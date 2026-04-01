import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
	BaseListParams,
	getMeetingsJoined,
	GetMeetingsJoinedParams,
	getMeetingsMy,
	getUsersMeReviews,
} from "./apis";

const DEFAULT_PARAMS = {
	sortBy: "dateTime",
	sortOrder: "desc",
	size: 10,
} as const;

const DEFAULT_REVIEW_PARAMS = {
	sortBy: "createdAt",
	sortOrder: "desc",
	size: 10,
} as const;

export const mypageQueryKeys = {
	all: ["mypage"] as const,
	// 참여한 모임 목록 (나의 모임, 작성 가능한 리뷰)
	meetups: ["mypage", "meetups"] as const,
	meetupsList: (params: GetMeetingsJoinedParams = {}) => ["mypage", "meetups", params] as const,
	// 작성한 리뷰 목록
	reviews: ["mypage", "reviews"] as const,
	reviewsList: (params: BaseListParams = {}) => ["mypage", "reviews", params] as const,
	// 만든 모임 목록
	created: ["mypage", "created"] as const,
	createdList: (params: BaseListParams = {}) => ["mypage", "created", params] as const,
} as const;

// 참여한 모임 목록 (나의 모임, 작성 가능한 리뷰)
export function useMyMeetupInfinite(params: Omit<GetMeetingsJoinedParams, "cursor"> = {}) {
	// 초기값과 외부에서 받은 params를 합침
	const mergedParams = { ...DEFAULT_PARAMS, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.meetupsList(mergedParams),
		queryFn: ({ pageParam }) =>
			getMeetingsJoined({
				...mergedParams,
				cursor: pageParam,
			}),

		// hasMore가 false 거나 undefined면 fetch 안 함
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,

		// 처음 값은 커서 없이 요청 undefined
		initialPageParam: undefined as string | undefined,
		staleTime: 1000 * 60 * 3,
	});
}

// 내가 작성한 리뷰 목록 조회
export function useMyReviewInfinite(params: Omit<BaseListParams, "cursor"> = {}) {
	const mergedParams = { ...DEFAULT_REVIEW_PARAMS, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.reviewsList(mergedParams),
		queryFn: ({ pageParam }) =>
			getUsersMeReviews({
				...mergedParams,
				cursor: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
		initialPageParam: undefined as string | undefined,
		staleTime: 1000 * 60 * 3,
	});
}

// 내가 만든 모임 목록
export function useMyCreatedInfinite(params: Omit<BaseListParams, "cursor"> = {}) {
	const mergedParams = { ...DEFAULT_PARAMS, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.createdList(mergedParams),
		queryFn: ({ pageParam }) =>
			getMeetingsMy({
				...mergedParams,
				cursor: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
		initialPageParam: undefined as string | undefined,
		staleTime: 1000 * 60 * 3,
	});
}
