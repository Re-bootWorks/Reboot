import { clientFetch } from "@/libs/clientFetch";
import {
	RatingSummaryResponse,
	ReviewCategoryStatistics,
	ReviewsListRequest,
	ReviewsListResponse,
} from "../types";
import { buildQuery, getErrorMessage, toDateTimeRangeEnd, toDateTimeRangeStart } from "../utils";
import {
	ROUTE_REVIEWS,
	ROUTE_REVIEWS_CATEGORIES_STATISTICS,
	ROUTE_REVIEWS_STATISTICS,
} from "../constants/routes";

/** 리뷰 목록 조회 */
export async function getReviews(params: ReviewsListRequest): Promise<ReviewsListResponse> {
	const query = buildQuery({
		type: params.type,
		region: params.region,
		dateStart: toDateTimeRangeStart(params.dateStart),
		dateEnd: toDateTimeRangeEnd(params.dateEnd),
		registrationEndStart: toDateTimeRangeStart(params.registrationEndStart),
		registrationEndEnd: toDateTimeRangeEnd(params.registrationEndEnd),
		sortBy: params.sortBy,
		sortOrder: params.sortOrder,
		cursor: params.cursor,
		size: params.size,
	});

	const response = await clientFetch(query ? `${ROUTE_REVIEWS}?${query}` : ROUTE_REVIEWS);

	if (!response.ok) {
		throw new Error(`${getErrorMessage(response.status)} ${response.status} 에러`);
	}

	return response.json();
}

/** 리뷰 전체 통계 조회 */
export async function getReviewsStatistics(): Promise<RatingSummaryResponse> {
	const response = await clientFetch(ROUTE_REVIEWS_STATISTICS);

	if (!response.ok) {
		throw new Error(`${getErrorMessage(response.status)} ${response.status} 에러`);
	}

	return response.json();
}

/** 카테고리 별 리뷰 통계 조회 */
export async function getReviewsCategoriesStatistics(): Promise<ReviewCategoryStatistics> {
	const response = await clientFetch(ROUTE_REVIEWS_CATEGORIES_STATISTICS);

	if (!response.ok) {
		throw new Error(`${getErrorMessage(response.status)} ${response.status} 에러`);
	}

	return response.json();
}
