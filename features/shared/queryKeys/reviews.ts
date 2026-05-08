import { ReviewsListKeyParams } from "@/features/reviews/types";

const REVIEWS_QUERY_BASE_KEY = ["reviews"] as const;

/** 리뷰 관련한경우 = reviewsQueryKeys.reviews.all */
export const reviewsQueryKeys = {
	reviews: {
		all: REVIEWS_QUERY_BASE_KEY,
		/** 모든 리뷰 리스트 */
		list: (params: ReviewsListKeyParams) => [...REVIEWS_QUERY_BASE_KEY, "list", params] as const,
		/** 모든 리뷰 총점 평균 통계 */
		statistics: [...REVIEWS_QUERY_BASE_KEY, "statistics"] as const,
		/** 모든 리뷰 타입 별 총점 평균 통계 */
		categories: {
			statistics: [...REVIEWS_QUERY_BASE_KEY, "categories", "statistics"] as const,
		},
	},
};
