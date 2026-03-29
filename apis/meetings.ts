import { clientFetch } from "@/libs/clientFetch";
import { MeetupItemResponse } from "@/features/meetup/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

const ROUTE_MEETINGS_FAVORITES = (meetingId: number) => `/meetings/${meetingId}/favorites`;
const ROUTE_MEETINGS_JOIN = (meetingId: number) => `/meetings/${meetingId}/join`;

/** 모임 찜 추가 */
export async function postMeetingsFavorite({
	meetingId,
}: {
	meetingId: number;
}): Promise<MeetupItemResponse> {
	const route = ROUTE_MEETINGS_FAVORITES(meetingId);
	const res = await clientFetch(route, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) {
		const error: ErrorResponse = await res
			.json()
			.catch(() => ({ code: "UNKNOWN_ERROR", message: "모임 찜 추가에 실패했습니다." }));
		throw new Error(error.message);
	}
	return res.json();
}

/** 모임 찜 해제 */
export async function deleteMeetingsFavorite({
	meetingId,
}: {
	meetingId: number;
}): Promise<SuccessResponse> {
	const route = ROUTE_MEETINGS_FAVORITES(meetingId);
	const res = await clientFetch(route, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) {
		const error: ErrorResponse = await res
			.json()
			.catch(() => ({ code: "UNKNOWN_ERROR", message: "모임 찜 해제에 실패했습니다." }));
		throw new Error(error.message);
	}
	return res.json();
}

/** 모임 참여 */
export async function postMeetingsJoin({
	meetingId,
}: {
	meetingId: number;
}): Promise<SuccessResponse> {
	const route = ROUTE_MEETINGS_JOIN(meetingId);
	const res = await clientFetch(route, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) {
		const error: ErrorResponse = await res
			.json()
			.catch(() => ({ code: "UNKNOWN_ERROR", message: "모임 참여에 실패했습니다." }));
		throw new Error(error.message);
	}
	return res.json();
}

/** 모임 참여 취소 */
export async function deleteMeetingsJoin({
	meetingId,
}: {
	meetingId: number;
}): Promise<SuccessResponse> {
	const route = ROUTE_MEETINGS_JOIN(meetingId);
	const res = await clientFetch(route, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) {
		const error: ErrorResponse = await res
			.json()
			.catch(() => ({ code: "UNKNOWN_ERROR", message: "모임 참여 취소에 실패했습니다." }));
		throw new Error(error.message);
	}
	return res.json();
}

export interface SuccessResponse {
	message: string;
}
export interface ErrorResponse {
	code: string;
	message: string;
}
