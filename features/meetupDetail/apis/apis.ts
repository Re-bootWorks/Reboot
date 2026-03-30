import { Meeting, ParticipantsResponse, ReviewsResponse } from "@/features/meetupDetail/types";
import { clientFetch } from "@/libs/clientFetch";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { MeetupListResponse } from "@/features/meetup/types";
import { getMeetups } from "@/features/meetup/apis";

/** 모임 상세 조회 */
export async function getMeetingDetail(meetingId: number): Promise<Meeting> {
	const res = await clientFetch(`/meetings/${meetingId}`);
	if (!res.ok) throw new Error("모임 정보를 불러오지 못했습니다.");
	return res.json();
}

/** 참가자 목록 조회 */
export async function getParticipants(meetingId: number): Promise<ParticipantsResponse> {
	const res = await clientFetch(`/meetings/${meetingId}/participants`);
	if (!res.ok) throw new Error("참가자 목록을 불러오지 못했습니다.");
	return res.json();
}

/** 리뷰 목록 조회 */
const REVIEWS_PER_PAGE = 4;
export async function getReviews(meetingId: number, cursor?: string): Promise<ReviewsResponse> {
	const params = new URLSearchParams({ size: String(REVIEWS_PER_PAGE) });
	if (cursor) params.append("cursor", cursor);
	const res = await clientFetch(`/meetings/${meetingId}/reviews?${params}`);
	if (!res.ok) throw new Error("리뷰 목록을 불러오지 못했습니다.");
	return res.json();
}

/** 모임 참여 */
export async function postJoin(meetingId: number) {
	const res = await clientFetch(`/meetings/${meetingId}/join`, { method: "POST" });
	if (!res.ok) {
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 참여에 실패했습니다.");
	}
}

/** 모임 참여 취소 */
export async function deleteJoin(meetingId: number) {
	const res = await clientFetch(`/meetings/${meetingId}/join`, { method: "DELETE" });
	if (!res.ok) {
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 참여 취소에 실패했습니다.");
	}
}

/** 모임 수정 */
export async function patchMeeting(meetingId: number, data: MeetupEditData) {
	const { _addressName, _addressDetail, ...rest } = data;
	const res = await clientFetch(`/meetings/${meetingId}`, {
		method: "PATCH",
		body: JSON.stringify(rest),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 수정에 실패했습니다.");
	}
}

/** 모임 삭제 */
export async function deleteMeeting(meetingId: number) {
	const res = await clientFetch(`/meetings/${meetingId}`, { method: "DELETE" });

	if (!res.ok) {
		const error = await res.json().catch(() => null);
		throw new Error(error?.message ?? "모임 삭제에 실패했습니다.");
	}
}

// TODO: 추후 4개를 어떻게 가져올지 팀과 논의 예정, 현재는 마감기한 임박순 4개로 임시 적용함.
/** 관련 모임 목록 조회 (4개) */
export async function getRelatedMeetings(): Promise<MeetupListResponse> {
	return getMeetups({ size: 4, sortBy: "registrationEnd", sortOrder: "asc" });
}
