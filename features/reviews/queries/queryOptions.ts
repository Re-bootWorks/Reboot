import { queryOptions } from "@tanstack/react-query";
import { RatingSummaryResponse, ReviewsListRequest, ReviewsListResponse } from "../types";
import { queryKeys } from "./queryKeys";

export function reviewsInfiniteOptions(
	params: ReviewsListRequest,
	getReviews: (params: ReviewsListRequest) => Promise<ReviewsListResponse>,
) {
	return {
		queryKey: queryKeys.reviews.list(params),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			getReviews({
				...params,
				cursor: pageParam ?? undefined,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: ReviewsListResponse) => {
			if (!lastPage.hasMore) return undefined;
			return lastPage.nextCursor ?? undefined;
		},
		staleTime: 60 * 1000,
		gcTime: 5 * 60 * 1000,
	};
}

export function reviewsStatisticsOptions(
	getReviewsStatistics: () => Promise<RatingSummaryResponse>,
	initialData?: RatingSummaryResponse,
) {
	return queryOptions({
		queryKey: queryKeys.reviews.statistics,
		queryFn: () => getReviewsStatistics(),
		initialData,
		staleTime: 60 * 1000,
		gcTime: 5 * 60 * 1000,
	});
}
