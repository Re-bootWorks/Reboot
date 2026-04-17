import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
	BaseListParams,
	getMeetingsJoined,
	GetMeetingsJoinedParams,
	getUsersMeMeetings,
	GetUsersMeMeetingsParams,
	getUsersMeReviews,
} from "./apis";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";

const DEFAULT_PARAMS = {
	sortBy: "dateTime",
	sortOrder: "desc",
	size: 10,
} as const;

// 내가 참여한 모임 목록
export function useMyJoinedInfinite(params: Omit<GetUsersMeMeetingsParams, "cursor"> = {}) {
	const mergedParams = { ...DEFAULT_PARAMS, ...params, type: "joined" as const };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.meetups.joinedList(mergedParams),
		queryFn: ({ pageParam }) =>
			getUsersMeMeetings({
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
export function useMyCreatedInfinite(params: Omit<GetUsersMeMeetingsParams, "cursor"> = {}) {
	const mergedParams = {
		...DEFAULT_PARAMS,
		sortBy: "createdAt" as const,
		...params,
		type: "created" as const,
	};

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.meetups.createdList(mergedParams),
		queryFn: ({ pageParam }) =>
			getUsersMeMeetings({
				...mergedParams,
				cursor: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
		initialPageParam: undefined as string | undefined,
		staleTime: 1000 * 60 * 3,
	});
}

// 작성 가능한 리뷰
export function useMyMeetupInfinite(params: Omit<GetMeetingsJoinedParams, "cursor"> = {}) {
	// 초기값과 외부에서 받은 params를 합침
	const mergedParams = { ...DEFAULT_PARAMS, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.reviews.availableList(mergedParams),
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
	const mergedParams = { ...DEFAULT_PARAMS, sortBy: "createdAt" as const, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.reviews.writtenList(mergedParams),
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
