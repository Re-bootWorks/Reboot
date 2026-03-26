import { clientFetch } from "@/libs/clientFetch";
import { ErrorResponse, MeetupCreateData, MeetupDetailData } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
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
