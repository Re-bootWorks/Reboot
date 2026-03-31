import { serverFetch } from "@/libs/serverFetch";
import { Meeting, ParticipantsResponse, ReviewsResponse } from "@/features/meetupDetail/types";

export async function getMeetingDetailServer(meetingId: number): Promise<Meeting> {
	const res = await serverFetch(`/meetings/${meetingId}`);
	if (!res.ok) throw new Error("모임 정보를 불러오지 못했습니다.");
	return res.json();
}

export async function getParticipantsServer(meetingId: number): Promise<ParticipantsResponse> {
	const res = await serverFetch(`/meetings/${meetingId}/participants`);
	if (!res.ok) throw new Error("참가자 목록을 불러오지 못했습니다.");
	return res.json();
}

export async function getReviewsServer(meetingId: number): Promise<ReviewsResponse> {
	const res = await serverFetch(`/meetings/${meetingId}/reviews?size=4`);
	if (!res.ok) throw new Error("리뷰 목록을 불러오지 못했습니다.");
	return res.json();
}
