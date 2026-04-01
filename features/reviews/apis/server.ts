import { serverFetch } from "@/libs/serverFetch";
import type {
	RatingSummaryResponse,
	ReviewCategoryStatistics,
	ReviewsListRequest,
	ReviewsListResponse,
} from "../types";
import { buildQuery, toDateTimeRangeEnd, toDateTimeRangeStart, toOptionalNumber } from "../utils";
import {
	ROUTE_REVIEWS,
	ROUTE_REVIEWS_CATEGORIES_STATISTICS,
	ROUTE_REVIEWS_STATISTICS,
} from "../constants/routes";
import { throwApiError } from "@/utils/api";

/** 리뷰 목록 조회 */
export async function getReviews(
	params?: ReviewsListRequest | URLSearchParams,
): Promise<ReviewsListResponse> {
	const normalizedParams =
		params instanceof URLSearchParams ? fromSearchParams(params) : (params ?? {});

	const query = buildQuery({
		type: normalizedParams.type,
		region: normalizedParams.region,
		dateStart: toDateTimeRangeStart(normalizedParams.dateStart),
		dateEnd: toDateTimeRangeEnd(normalizedParams.dateEnd),
		registrationEndStart: toDateTimeRangeStart(normalizedParams.registrationEndStart),
		registrationEndEnd: toDateTimeRangeEnd(normalizedParams.registrationEndEnd),
		sortBy: normalizedParams.sortBy,
		sortOrder: normalizedParams.sortOrder,
		cursor: normalizedParams.cursor,
		size: normalizedParams.size,
	});

	const response = await serverFetch(query ? `${ROUTE_REVIEWS}?${query}` : ROUTE_REVIEWS);

	await throwApiError(response, "리뷰 목록 조회에 실패했습니다.");
	return response.json();
}

function fromSearchParams(searchParams: URLSearchParams): ReviewsListRequest {
	return {
		type: searchParams.get("type") ?? undefined,
		region: searchParams.get("region") ?? undefined,
		dateStart: searchParams.get("dateStart") ?? undefined,
		dateEnd: searchParams.get("dateEnd") ?? undefined,
		registrationEndStart: searchParams.get("registrationEndStart") ?? undefined,
		registrationEndEnd: searchParams.get("registrationEndEnd") ?? undefined,
		sortBy: (searchParams.get("sortBy") as ReviewsListRequest["sortBy"]) ?? undefined,
		sortOrder: (searchParams.get("sortOrder") as ReviewsListRequest["sortOrder"]) ?? undefined,
		cursor: searchParams.get("cursor") ?? undefined,
		size: toOptionalNumber(searchParams.get("size")),
	};
}

/** 리뷰 전체 통계 조회 */
export async function getReviewsStatistics(): Promise<RatingSummaryResponse> {
	const response = await serverFetch(ROUTE_REVIEWS_STATISTICS);

	await throwApiError(response, "리뷰 전체 통계 조회에 실패했습니다.");
	return response.json();
}

/** 카테고리 별 리뷰 통계 조회 */
export async function getReviewsCategoriesStatistics(): Promise<ReviewCategoryStatistics> {
	const response = await serverFetch(ROUTE_REVIEWS_CATEGORIES_STATISTICS);

	await throwApiError(response, "카테고리 별 리뷰 통계 조회에 실패했습니다.");
	return response.json();
}
