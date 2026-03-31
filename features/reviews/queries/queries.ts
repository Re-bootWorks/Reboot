import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewsCategoriesStatisticsOptions, reviewsStatisticsOptions } from "./queryOptions";
import { getReviewsCategoriesStatistics, getReviewsStatistics } from "../apis/client";

export function useReviewsStatistics() {
	return useSuspenseQuery(reviewsStatisticsOptions(getReviewsStatistics));
}

export function useReviewsCategoriesStatistics() {
	return useSuspenseQuery(reviewsCategoriesStatisticsOptions(getReviewsCategoriesStatistics));
}
