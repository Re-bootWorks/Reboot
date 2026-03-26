import { clientFetch } from "@/libs/clientFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

export interface ErrorResponse {
	code: string;
	message: string;
}
export type UploadImageFn = (file: File) => Promise<string | ErrorResponse>;
export interface PresignedUrlResponse {
	presignedUrl: string;
	publicUrl: string;
}

/** 이미지 업로드 */
export async function uploadImage(file: File): Promise<string | ErrorResponse> {
	try {
		const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
		await uploadToS3(presignedUrl, file);
		return publicUrl;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "이미지 업로드 중 알 수 없는 오류가 발생했습니다.";
		return { code: "UPLOAD_ERROR", message };
	}
}

/** 이미지 업로드 Step1: presigned URL 발급 */
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

	if (!res.ok) throw new Error(`이미지 업로드 주소 생성에 실패했습니다. (${res.status})`);
	return res.json();
}

/** 이미지 업로드 Step2: S3에 이미지 업로드 */
async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
	const res = await fetch(presignedUrl, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	});

	if (!res.ok) throw new Error(`이미지 업로드에 실패했습니다. (${res.status})`);
}
