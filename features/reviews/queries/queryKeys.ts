import { ReviewsListKeyParams } from "../types";

const REVIEWS_QUERY_BASE_KEY = ["reviews"] as const;

export const reviewsQueryKeys = {
	reviews: {
		all: REVIEWS_QUERY_BASE_KEY,
		list: (params: ReviewsListKeyParams) => [...REVIEWS_QUERY_BASE_KEY, "list", params] as const,
		statistics: [...REVIEWS_QUERY_BASE_KEY, "statistics"] as const,
		categories: {
			statistics: [...REVIEWS_QUERY_BASE_KEY, "categories", "statistics"] as const,
		},
	},
};
