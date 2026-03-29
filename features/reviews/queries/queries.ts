import { useQuery } from "@tanstack/react-query";
import { reviewsStatisticsOptions } from "./queryOptions";
import { getReviewsCategoriesStatistics, getReviewsStatistics } from "../apis/client";
import { ReviewCategoryStatistics } from "../types";
import { queryKeys } from "./queryKeys";

export function useReviewsStatistics() {
	return useQuery(reviewsStatisticsOptions(getReviewsStatistics));
}

export function useReviewsCategoriesStatistics() {
	return useQuery<ReviewCategoryStatistics>({
		queryKey: queryKeys.reviews.categories.statistics,
		queryFn: getReviewsCategoriesStatistics,
		staleTime: 30 * 1000,
	});
}
