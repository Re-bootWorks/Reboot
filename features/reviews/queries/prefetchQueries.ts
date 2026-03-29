import { QueryClient } from "@tanstack/react-query";
import { ReviewsListRequest } from "../types";
import { reviewsInfiniteOptions, reviewsStatisticsOptions } from "./queryOptions";
import { getReviews, getReviewsStatistics } from "../apis/server";

export async function prefetchReviews(queryClient: QueryClient, params: ReviewsListRequest) {
	await queryClient.prefetchInfiniteQuery(reviewsInfiniteOptions(params, getReviews));
}

export async function prefetchReviewsStatistics(queryClient: QueryClient) {
	await queryClient.prefetchQuery(reviewsStatisticsOptions(getReviewsStatistics));
}
