import { clientFetch } from "@/libs/clientFetch";
import { ErrorResponse, MeetupCreateData, MeetupDetailData, PresignedUrlResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

/** 이미지 업로드 */
export async function uploadImage(file: File): Promise<string | ErrorResponse> {
	const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
	await uploadToS3(presignedUrl, file);
	return publicUrl;
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

/** 카카오 장소 검색 API(목록 표시) */
const ROUTE_KAKAO_PLACE = "/kakao/place";
export async function getKakaoPlace(query: string) {
	const res = await clientFetch(`${ROUTE_KAKAO_PLACE}?query=${query}`);
	if (!res.ok) {
		throw new Error(`카카오 장소 검색 API 호출에 실패했습니다. (${res.status})`);
	}

	const data = await res.json();
	const { documents } = data;
	return documents;
}

/** 모임 생성 */
const ROUTE_MEETINGS = "/meetings";
export async function postMeetup(
	data: MeetupCreateData,
): Promise<MeetupDetailData | ErrorResponse> {
	const res = await clientFetch(ROUTE_MEETINGS, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error(`모임 생성에 실패했습니다. (${res.status})`);
	return res.json();
}
