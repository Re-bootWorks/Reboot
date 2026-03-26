import { Meeting, ParticipantsResponse, ReviewsResponse } from "@/features/meetupDetail/types";
import { mockInformationData } from "@/features/meetupDetail/components/Containers/InformationContainer/mocks";
import { mockParticipants } from "@/features/meetupDetail/components/Containers/PersonnelContainer/mocks";
import { mockReviews } from "@/features/meetupDetail/components/Cards/CommentCards/mocks";
//
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
//
// if (!BASE_URL) {
// 	throw new Error("BASE URL이 유효하지 않습니다.");
// }

export async function getMeetingDetail(meetingId: number): Promise<Meeting> {
	// TODO: 추후 실제 API로 교체 예정 (아래는 예시)
	// const res = await fetch(`${BASE_URL}/meetings/${meetingId}`, {
	// 	next: { tags: [`meeting-${meetingId}`] },
	// });
	//
	// if (!res.ok) throw new Error("모임 정보를 불러오지 못했습니다.");
	//
	// return res.json();

	return mockInformationData.find((m) => m.id === meetingId) ?? mockInformationData[0];
}

export async function getParticipants(meetingId: number): Promise<ParticipantsResponse> {
	// TODO: 추후 실제 API로 교체 예정 (아래는 예시)
	// const res = await fetch(`${BASE_URL}/meetings/${meetingId}/participants`, {
	// 	next: { tags: [`participants-${meetingId}`] },
	// });
	//
	// if (!res.ok) throw new Error("참가자 목록을 불러오지 못했습니다.");
	//
	// return res.json();
	return { data: mockParticipants, nextCursor: "", hasMore: false };
}

export async function getReviews(meetingId: number): Promise<ReviewsResponse> {
	// TODO: 추후 실제 API로 교체 예정 (아래는 예시)
	// const res = await fetch(`${BASE_URL}/meetings/${meetingId}/reviews`, {
	// 	next: { tags: [`reviews-${meetingId}`] },
	// });
	//
	// if (!res.ok) throw new Error("리뷰 목록을 불러오지 못했습니다.");
	//
	// return res.json();

	return { data: mockReviews, nextCursor: "", hasMore: false };
}
