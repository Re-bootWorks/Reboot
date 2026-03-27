import type { Category } from "@/store/category.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

const ROUTE_MEETING_TYPES = "/meeting-types";
export async function getMeetingTypes(): Promise<MeetingTypeResponse> {
	const res = await fetch(`${BASE_URL}${ROUTE_MEETING_TYPES}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		cache: "force-cache",
	});

	if (!res.ok) throw new Error(`모임 카테고리 조회에 실패했습니다. (${res.status})`);
	return res.json();
}

/** layout.tsx 에서 사용. 렌더링 blocking 방지 */
export async function initMeetingTypes(): Promise<MeetingTypeResponse | null> {
	try {
		return await getMeetingTypes();
	} catch (e) {
		console.error("[getMeetingTypes]", e);
		return null;
	}
}

export type MeetingTypeResponse = ({
	id: number;
	createdAt: string;
} & Category)[];
