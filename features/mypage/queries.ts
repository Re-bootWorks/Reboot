import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
	BaseListParams,
	getMeetingsJoined,
	GetMeetingsJoinedParams,
	getUsersMeMeetings,
	GetUsersMeMeetingsParams,
	getUsersMeReviews,
} from "./apis";

const DEFAULT_PARAMS = {
	sortBy: "dateTime",
	sortOrder: "desc",
	size: 10,
} as const;

const WRITTEN_REVIEW_PARAMS = {
	...DEFAULT_PARAMS,
	sortBy: "createdAt",
} as const;

const MYPAGE_QUERY_BASE_KEY = ["mypage"] as const;

export const mypageQueryKeys = {
	all: MYPAGE_QUERY_BASE_KEY,

	meetup: {
		all: [...MYPAGE_QUERY_BASE_KEY, "meetups"] as const,
		joined: [...MYPAGE_QUERY_BASE_KEY, "meetups", "joined"] as const,
		joinedList: (params: GetUsersMeMeetingsParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "meetups", "joined", params] as const,

		created: [...MYPAGE_QUERY_BASE_KEY, "meetups", "created"] as const,
		createdList: (params: GetUsersMeMeetingsParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "meetups", "created", params] as const,
	},

	review: {
		all: [...MYPAGE_QUERY_BASE_KEY, "reviews"] as const,
		available: [...MYPAGE_QUERY_BASE_KEY, "reviews", "available"] as const,
		availableList: (params: GetMeetingsJoinedParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "reviews", "available", params] as const,

		written: [...MYPAGE_QUERY_BASE_KEY, "reviews", "written"] as const,
		writtenList: (params: BaseListParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "reviews", "written", params] as const,
	},

	// @TODO 삭제예정 legacy
	meetups: ["mypage", "meetups"] as const,
	meetupsList: (params: GetMeetingsJoinedParams = {}) => ["mypage", "meetups", params] as const,

	reviews: ["mypage", "reviews"] as const,
	reviewsList: (params: BaseListParams = {}) => ["mypage", "reviews", params] as const,

	created: ["mypage", "created"] as const,
	createdList: (params: GetUsersMeMeetingsParams = {}) => ["mypage", "created", params] as const,
} as const;

// 내가 참여한 모임 목록
export function useMyJoinedInfinite(params: Omit<GetUsersMeMeetingsParams, "cursor"> = {}) {
	const mergedParams = { ...DEFAULT_PARAMS, ...params, type: "joined" as const };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.meetup.joinedList(mergedParams),
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
	const mergedParams = { ...DEFAULT_PARAMS, ...params, type: "created" as const };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.meetup.createdList(mergedParams),
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
		queryKey: mypageQueryKeys.review.availableList(mergedParams),
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
	const mergedParams = { ...WRITTEN_REVIEW_PARAMS, ...params };

	return useSuspenseInfiniteQuery({
		queryKey: mypageQueryKeys.review.writtenList(mergedParams),
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
