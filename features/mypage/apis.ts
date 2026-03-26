import {
	mockMyCreated,
	mockMyMeetups,
	mockMyReviews,
	mockMyWritableReview,
} from "@/features/mypage/mockData";
import { ReviewList } from "@/features/mypage/components/ReviewCard/type";
import { CreatedList, MeetupList, WritableReviewList } from "@/features/mypage/type";

const MOCK_DELAY_MS = 150;

function delay(ms = MOCK_DELAY_MS) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CursorPageResponse<T> {
	data: T;
	nextCursor: string | null;
	hasMore: boolean;
}

export type MeetingStatus = "CONFIRMED" | "CANCELED";

export interface ReviewPayload {
	score: number;
	comment: string;
}

export async function getMeetingJoined(): Promise<CursorPageResponse<MeetupList>> {
	/*
		@TODO 추후 api 연동 
		const res = await fetch
		const json = await res.json();

	  return {
    ...json,
    data: json.data.map(mapJoinedMeeting),
  };
	*/
	// GET/{teamId}/meetings/joined 참여한 모임 목록 조회
	await delay();
	return {
		data: mockMyMeetups,
		nextCursor: null,
		hasMore: false,
	};
}

export async function getMeWritableReviews(): Promise<CursorPageResponse<WritableReviewList>> {
	// GET/{teamId}/meetings/joined 참여한 모임 목록 조회 중 completed=true&reviewed=true 필터링
	// getMeetingJoined 파라미터만 변경해서 같이 사용 예정
	await delay();
	return {
		data: mockMyWritableReview,
		nextCursor: null,
		hasMore: false,
	};
}

export async function getMeReviews(): Promise<CursorPageResponse<ReviewList>> {
	// GET/{teamId}/users/me/reviews 내가 작성한 리뷰 목록 조회
	await delay();
	return {
		data: mockMyReviews,
		nextCursor: null,
		hasMore: false,
	};
}

export async function getMeetingsMy(): Promise<CursorPageResponse<CreatedList>> {
	// GET/{teamId}/meetings/my 내가 만든 모임 목록
	await delay();
	return {
		data: mockMyCreated,
		nextCursor: null,
		hasMore: false,
	};
}

export async function patchMeetingStatus(meetingId: number, status: MeetingStatus): Promise<void> {
	// PATCH/{teamId}/meetings/{meetingId}/status
	await delay();
	console.log(status === "CONFIRMED" ? "모임 확정 성공" : "모임 취소 성공", meetingId);
}

export async function deleteMeeting(meetingId: number): Promise<void> {
	// DELETE/{teamId}/meetings/{meetingId}
	await delay();
	console.log("모임 삭제 성공", meetingId);
}

export async function deleteMeetingJoin(meetingId: number): Promise<void> {
	// DELETE/{teamId}/meetings/{meetingId}/join
	await delay();
	console.log("예약 취소 성공", meetingId);
}

export async function postReview(
	meetingId: number,
	reviewFormValues: ReviewPayload,
): Promise<void> {
	// POST/{teamId}/meetings/{meetingId}/reviews
	await delay();
	console.log("리뷰 작성 성공", meetingId, reviewFormValues);
}

export async function patchReview(
	reviewId: number,
	reviewFormValues: ReviewPayload,
): Promise<void> {
	// PATCH/{teamId}/reviews/{reviewId}
	await delay();
	console.log("리뷰 수정 성공", reviewId, reviewFormValues);
}

export async function deleteReview(reviewId: number): Promise<void> {
	// DELETE/{teamId}/reviews/{reviewId}
	await delay();
	console.log("리뷰 삭제 성공", reviewId);
}

export async function postMeetingFavorite(meetingId: number): Promise<void> {
	// POST/{teamId}/meetings/{meetingId}/favorites
	await delay();
	console.log("찜 추가 성공", meetingId);
}

export async function deleteMeetingFavorite(meetingId: number): Promise<void> {
	// DELETE/{teamId}/meetings/{meetingId}/favorites
	await delay();
	console.log("찜 해제 성공", meetingId);
}
