import { clientFetch } from "@/libs/clientFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

export interface ErrorResponse {
	code: string;
	message: string;
}
export interface ErrorResponsePresigned {
	success: boolean;
	error: {
		name: string;
		message: string;
	};
}
export type UploadImageFn = typeof uploadImage;
export interface PresignedUrlResponse {
	presignedUrl: string;
	publicUrl: string;
}

/** 이미지 업로드 */
export async function uploadImage(file: File): Promise<string> {
	const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
	await uploadToS3(presignedUrl, file);
	return publicUrl;
}

/** 이미지 업로드 Step1: presigned URL 발급 */
const DEFAULT_ERROR_PRESIGNED = {
	code: "UNKNOWN_ERROR",
	message: "이미지 업로드 주소 생성에 실패했습니다.",
};
const ROUTE_IMAGES = "/images/presigned";
async function getPresignedUrl(
	fileName: string,
	contentType: string,
	folder: string = "meetings",
): Promise<PresignedUrlResponse> {
	const res = await clientFetch(ROUTE_IMAGES, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ fileName, contentType, folder }),
	});

	if (!res.ok) {
		const error: ErrorResponse | ErrorResponsePresigned = await res
			.json()
			.catch(() => DEFAULT_ERROR_PRESIGNED);
		const message =
			"error" in error
				? error.error.name === "ZodError"
					? "파일 형식이 올바르지 않습니다."
					: error.error.message
				: error.message;
		throw new Error(message);
	}
	return res.json();
}

/** 이미지 업로드 Step2: S3에 이미지 업로드 */
async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
	const res = await fetch(presignedUrl, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	});

	if (!res.ok) {
		// 서버 에러 응답이 XML 형식이기 때문에 상태 코드로 분기 처리
		if (res.status >= 400) {
			throw new Error("잘못된 요청입니다.");
		}
		if (res.status >= 500) {
			throw new Error("서버에 일시적인 문제가 발생했습니다.");
		}
	}
}
