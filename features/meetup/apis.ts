import { clientFetch } from "@/libs/clientFetch";
import {
	MeetupCreateRequest,
	MeetupItemResponse,
	MeetupListRequest,
	MeetupListResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

// 카카오 장소 검색: 키워드로 장소 검색
export type getKakaoPlaceFn = typeof getKakaoPlace;

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

const ROUTE_MEETINGS = "/meetings";
/** 모임 찾기 */
export async function getMeetups(params: MeetupListRequest): Promise<MeetupListResponse> {
	// encodeURIComponent 자동 적용
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value != null) {
			queryParams.append(key, String(value));
		}
	}

	const res = await clientFetch(`${ROUTE_MEETINGS}?${queryParams}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	return res.json();
}

/** 모임 생성 */
export async function postMeetup(data: MeetupCreateRequest): Promise<MeetupItemResponse> {
	const res = await clientFetch(ROUTE_MEETINGS, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error(`모임 생성 API 호출에 실패했습니다.`);
	}
	return res.json();
}
