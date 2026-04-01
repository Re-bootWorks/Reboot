import { clientFetch } from "@/libs/clientFetch";
import {
	PatchReviewPayload,
	RatingSummaryResponse,
	ReviewCategoryStatistics,
	ReviewsListRequest,
	ReviewsListResponse,
} from "../types";
import { buildQuery, toDateTimeRangeEnd, toDateTimeRangeStart } from "../utils";
import {
	ROUTE_REVIEWS,
	ROUTE_REVIEWS_CATEGORIES_STATISTICS,
	ROUTE_REVIEWS_STATISTICS,
} from "../constants/routes";
import { throwApiError } from "@/utils/api";

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

	await throwApiError(response, "리뷰 목록 조회에 실패했습니다.");
	return response.json();
}

/** 리뷰 전체 통계 조회 */
export async function getReviewsStatistics(): Promise<RatingSummaryResponse> {
	const response = await clientFetch(ROUTE_REVIEWS_STATISTICS);

	await throwApiError(response, "리뷰 전체 통계 조회에 실패했습니다.");
	return response.json();
}

/** 카테고리 별 리뷰 통계 조회 */
export async function getReviewsCategoriesStatistics(): Promise<ReviewCategoryStatistics> {
	const response = await clientFetch(ROUTE_REVIEWS_CATEGORIES_STATISTICS);

	await throwApiError(response, "카테고리 별 리뷰 통계 조회에 실패했습니다.");
	return response.json();
}

/** 리뷰 수정 하기 */
export async function patchReviews({
	reviewId,
	reviewFormValues,
}: PatchReviewPayload): Promise<void> {
	const response = await clientFetch(`/reviews/${reviewId}`, {
		method: "PATCH",
		body: JSON.stringify(reviewFormValues),
	});

	await throwApiError(response, "리뷰 수정에 실패했습니다.");
}

/** 리뷰 삭제 하기 */
export async function deleteReviews({ reviewId }: { reviewId: number }): Promise<void> {
	const response = await clientFetch(`/reviews/${reviewId}`, {
		method: "DELETE",
	});

	await throwApiError(response, "리뷰 삭제에 실패했습니다.");
}
