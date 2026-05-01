import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { uploadImage, ROUTE_IMAGES, ROUTE_IMAGES_UPLOAD } from "./images";

const mockPresignedUrl = "https://s3.example.com/presigned";
const mockPublicUrl = "https://cdn.example.com/image.png";
const mockFileName = "test.png";
const mockFileType = "image/png";

const ENDPOINT_PRESIGNED = `/api${ROUTE_IMAGES}`;
const ENDPOINT_UPLOAD = `/api${ROUTE_IMAGES_UPLOAD}`;

function createMockFile(name: string, type: string) {
	return new File(["dummy"], name, { type });
}

describe("uploadImage api 테스트", () => {
	test("presigned URL 발급 후 S3 업로드에 성공하면 publicUrl을 반환함", async () => {
		server.use(
			http.post(ENDPOINT_PRESIGNED, () =>
				HttpResponse.json(
					{ presignedUrl: mockPresignedUrl, publicUrl: mockPublicUrl },
					{ status: 200 },
				),
			),
			http.put(ENDPOINT_UPLOAD, () => HttpResponse.json({}, { status: 200 })),
		);

		const file = createMockFile(mockFileName, mockFileType);
		const result = await uploadImage(file);

		expect(result).toBe(mockPublicUrl);
	});

	test("지원하지 않는 파일 형식이면 에러를 throw함", async () => {
		const errorFileName = "test.svg";
		const errorFileType = "image/svg";
		const file = createMockFile(errorFileName, errorFileType);

		await expect(uploadImage(file)).rejects.toThrow(
			`'${errorFileType}'는 지원하지 않는 파일 형식입니다.`,
		);
	});

	test("presigned URL 발급에 실패하면 에러를 throw함", async () => {
		const errorResponse = { code: "PRESIGN_FAILED", message: "presigned URL 발급 실패" };
		server.use(
			http.post(ENDPOINT_PRESIGNED, () => HttpResponse.json(errorResponse, { status: 500 })),
		);

		const file = createMockFile(mockFileName, mockFileType);

		await expect(uploadImage(file)).rejects.toThrow(errorResponse.message);
	});

	test("presigned URL 발급 실패 시 응답 바디 파싱이 안 되면 기본 에러 메시지를 throw함", async () => {
		server.use(http.post(ENDPOINT_PRESIGNED, () => new HttpResponse(null, { status: 500 })));

		const file = createMockFile(mockFileName, mockFileType);

		await expect(uploadImage(file)).rejects.toThrow(
			"업로드 주소 생성 중 알 수 없는 에러가 발생했습니다.",
		);
	});

	test("S3 업로드에 실패하면 에러를 throw함", async () => {
		const errorResponse = { code: "UPLOAD_FAILED", message: "S3 업로드 실패" };

		server.use(
			http.post(ENDPOINT_PRESIGNED, () =>
				HttpResponse.json(
					{ presignedUrl: mockPresignedUrl, publicUrl: mockPublicUrl },
					{ status: 200 },
				),
			),
			http.put(ENDPOINT_UPLOAD, () => HttpResponse.json(errorResponse, { status: 500 })),
		);

		const file = createMockFile(mockFileName, mockFileType);

		await expect(uploadImage(file)).rejects.toThrow(errorResponse.message);
	});

	test("S3 업로드 실패 시 응답 바디 파싱이 안 되면 기본 에러 메시지를 throw함", async () => {
		server.use(
			http.post(ENDPOINT_PRESIGNED, () =>
				HttpResponse.json(
					{ presignedUrl: mockPresignedUrl, publicUrl: mockPublicUrl },
					{ status: 200 },
				),
			),
			http.put(ENDPOINT_UPLOAD, () => new HttpResponse(null, { status: 500 })),
		);

		const file = createMockFile(mockFileName, mockFileType);

		await expect(uploadImage(file)).rejects.toThrow("업로드 중 알 수 없는 에러가 발생했습니다.");
	});
});
