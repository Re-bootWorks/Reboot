import { User } from "@/features/auth/types";

import {
	CursorPageResponse,
	MeetupList,
	ReviewList,
	CreatedList,
	PatchUserProfilePayload,
	MeetingJoinedApiRes,
	MeReviewsApiRes,
	MeetingsMyApiRes,
	PatchMeetingStatusParams,
	PostReviewPayload,
	PatchReviewPayload,
} from "@/features/mypage/types";
import { clientFetch } from "@/libs/clientFetch";
import { mapJoinedMeeting, mapMeetingsMy, mapMeReviews } from "./mapper";
import { throwApiError } from "@/utils/api";

export interface BaseListParams {
	sortBy?: string;
	sortOrder?: string;
	cursor?: string;
	size?: number;
}
export interface GetMeetingsJoinedParams extends BaseListParams {
	completed?: boolean;
	reviewed?: boolean;
}

// 마이페이지 목록 api 공통 fetch
/**
 * @type ApiItem 서버에서 전달해주는 아이템 타입
 * @type MappedItem 받아온 데이터를 가공한 형태(mapper)
 * @type TParams 파라미터 객체 타입
 * @param endpoint 호출할 API 경로
 * @param params 쿼리스트링으로 바꿀 파라미터 객체
 * @param mapper 서버 원본 아이템 하나를 프론트용 아이템 하나로 바꾸는 함수
 * @returns Promise<CursorPageResponse<MappedItem[]>>
 * @example
 * return mypageFetch<MeetingJoinedApiRes, MeetupItem, GetMeetingsJoinedParams>(
		"/meetings/joined",
		params,
		mapJoinedMeeting,
	);
 */

async function mypageFetch<ApiItem, MappedItem, TParams extends object>(
	endpoint: string,
	params: TParams,
	mapper: (item: ApiItem) => MappedItem,
): Promise<CursorPageResponse<MappedItem[]>> {
	//  사용하지 않는 값 제거
	const searchParams = new URLSearchParams(
		Object.entries(params)
			.filter(([_, value]) => value !== undefined && value !== null && value !== "")
			.map(([key, value]) => [key, String(value)]),
	);

	const queryString = searchParams.toString();
	const url = queryString ? `${endpoint}?${queryString}` : endpoint;

	const res = await clientFetch(url);

	if (!res.ok) {
		throw new Error(`목록 조회 실패: ${res.status}`);
	}

	const json = await res.json();

	return {
		...json,
		data: json.data.map(mapper),
	};
}

// 내가 참여한 모임 목록 , 작성하지 않은 리뷰 목록
export async function getMeetingsJoined(
	params: GetMeetingsJoinedParams = {},
): Promise<CursorPageResponse<MeetupList>> {
	return mypageFetch<MeetingJoinedApiRes, MeetupList[number], GetMeetingsJoinedParams>(
		"/meetings/joined",
		params,
		mapJoinedMeeting,
	);
}

// 내가 작성한 리뷰 목록
export async function getUsersMeReviews(
	params: BaseListParams = {},
): Promise<CursorPageResponse<ReviewList>> {
	return mypageFetch<MeReviewsApiRes, ReviewList[number], BaseListParams>(
		"/users/me/reviews",
		params,
		mapMeReviews,
	);
}

// 내가 만든 모임 목록
export async function getMeetingsMy(
	params: BaseListParams = {},
): Promise<CursorPageResponse<CreatedList>> {
	return mypageFetch<MeetingsMyApiRes, CreatedList[number], BaseListParams>(
		"/meetings/my",
		params,
		mapMeetingsMy,
	);
}

// 모임 상태 변경 하기
export async function patchMeetingsStatus({
	meetingId,
	status,
}: PatchMeetingStatusParams): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
	});

	await throwApiError(res, "모임 상태 변경에 실패했습니다.");
}

// 모임 삭제 하기
export async function deleteMeetings({ meetingId }: { meetingId: number }): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}`, {
		method: "DELETE",
	});

	await throwApiError(res, "모임 삭제에 실패했습니다.");
}

// 모임 참여 취소 하기
export async function deleteMeetingsJoin({ meetingId }: { meetingId: number }): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}/join`, {
		method: "DELETE",
	});

	await throwApiError(res, "모임 예약 취소에 실패했습니다.");
}

// 리뷰 작성 하기
export async function postMeetingsReviews({
	meetingId,
	reviewFormValues,
}: PostReviewPayload): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}/reviews`, {
		method: "POST",
		body: JSON.stringify(reviewFormValues),
	});
	await throwApiError(res, "리뷰 작성에 실패했습니다.");
}

// 리뷰 수정 하기
export async function patchReviews({
	reviewId,
	reviewFormValues,
}: PatchReviewPayload): Promise<void> {
	const res = await clientFetch(`/reviews/${reviewId}`, {
		method: "PATCH",
		body: JSON.stringify(reviewFormValues),
	});
	await throwApiError(res, "리뷰 수정에 실패했습니다.");
}

// 리뷰 삭제 하기
export async function deleteReviews({ reviewId }: { reviewId: number }): Promise<void> {
	const res = await clientFetch(`/reviews/${reviewId}`, {
		method: "DELETE",
	});
	await throwApiError(res, "리뷰 삭제에 실패했습니다.");
}

// 찜 추가
export async function postMeetingsFavorites(meetingId: number): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}/favorites`, {
		method: "POST",
	});
	await throwApiError(res, "찜 추가에 실패했습니다.");
}

// 찜 해제
export async function deleteMeetingsFavorites(meetingId: number): Promise<void> {
	const res = await clientFetch(`/meetings/${meetingId}/favorites`, {
		method: "DELETE",
	});
	await throwApiError(res, "찜 해제에 실패했습니다.");
}

// image 업로드
export async function uploadProfileImage(file: File): Promise<string> {
	// presigned URL
	const presignedResponse = await clientFetch("/images/presigned", {
		method: "POST",
		body: JSON.stringify({
			fileName: file.name,
			contentType: file.type,
			folder: "mypage",
		}),
	});

	await throwApiError(presignedResponse, "이미지 업로드 URL 발급에 실패했습니다.");

	// public URL
	const { presignedUrl, publicUrl } = await presignedResponse.json();

	const uploadResponse = await fetch(presignedUrl, {
		method: "PUT",
		headers: {
			"Content-Type": file.type,
		},
		body: file,
	});

	if (!uploadResponse.ok) {
		throw new Error("이미지 업로드에 실패했습니다.");
	}

	return publicUrl;
}

// 유저 프로필
export async function patchUsersMe(user: PatchUserProfilePayload): Promise<User> {
	const res = await clientFetch("/users/me", {
		method: "PATCH",
		body: JSON.stringify(user),
	});
	await throwApiError(res, "프로필 수정에 실패했습니다.");

	return res.json();
}
