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

export const IMAGE_ACCEPT = "image/png, image/jpeg, image/gif, image/webp";
export const IMAGE_ACCEPTED_EXTS: string[] = IMAGE_ACCEPT.split(", ");

/** 이미지 업로드 */
export async function uploadImage(file: File) {
	if (!file) {
		throw new Error(`파일을 첨부해주세요.`);
	}
	if (!IMAGE_ACCEPTED_EXTS.includes(file.type)) {
		throw new Error(`'${file.type}'는 지원하지 않는 파일 형식입니다.`);
	}

	const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
	await uploadToS3(presignedUrl, file);
	return publicUrl;
}

/** 이미지 업로드 Step1: presigned URL 발급 */
const ROUTE_IMAGES = "/images/presigned";
async function getPresignedUrl(fileName: string, contentType: string, folder: string = "meetings") {
	const res = await clientFetch(ROUTE_IMAGES, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ fileName, contentType, folder }),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message);
	return data;
}

/** 이미지 업로드 Step2: S3에 이미지 업로드 */
const ROUTE_IMAGES_UPLOAD = "/images/upload";
async function uploadToS3(presignedUrl: string, file: File) {
	const res = await clientFetch(ROUTE_IMAGES_UPLOAD, {
		method: "PUT",
		headers: { "Content-Type": file.type, "X-Presigned-Url": presignedUrl },
		body: file,
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message);
	return data;
}
