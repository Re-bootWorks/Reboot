import { clientFetch } from "@/libs/clientFetch";
import {
	MeetupCreateRequest,
	MeetupItemResponse,
	MeetupListRequest,
	MeetupListResponse,
} from "./types";
import { buildMeetupListQuery } from "./list/utils";

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
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "카카오 장소 검색 API 호출에 실패했습니다.");
	}

	const data = await res.json();
	const { documents } = data;
	return documents;
}

const ROUTE_MEETINGS = "/meetings";

/** 모임 찾기 */
export async function getMeetups(params: MeetupListRequest): Promise<MeetupListResponse> {
	const qs = buildMeetupListQuery(params);
	const res = await clientFetch(qs ? `${ROUTE_MEETINGS}?${qs}` : ROUTE_MEETINGS, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!res.ok) {
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 목록을 불러오는데 실패했습니다.");
	}
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
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 생성에 실패했습니다.");
	}
	return res.json();
}
