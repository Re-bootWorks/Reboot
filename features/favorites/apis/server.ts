import { serverFetch } from "@/libs/serverFetch";
import { throwApiError } from "@/utils/api";
import type { FavoritesListResponse, FavoritesListRequest } from "../types";
import { ROUTE_FAVORITES } from "../constants/routes";
import {
	buildQuery,
	getFavoritesErrorMessage,
	toDateTimeRangeEnd,
	toDateTimeRangeStart,
	toOptionalNumber,
} from "../utils";

/** 찜 목록 조회 */
export async function getFavorites(
	params?: FavoritesListRequest | URLSearchParams,
): Promise<FavoritesListResponse> {
	const normalizedParams =
		params instanceof URLSearchParams ? fromSearchParams(params) : (params ?? {});

	const query = buildQuery({
		type: normalizedParams.type,
		region: normalizedParams.region,
		dateStart: toDateTimeRangeStart(normalizedParams.dateStart),
		dateEnd: toDateTimeRangeEnd(normalizedParams.dateEnd),
		sortBy: normalizedParams.sortBy,
		sortOrder: normalizedParams.sortOrder,
		cursor: normalizedParams.cursor,
		size: normalizedParams.size,
	});

	const response = await serverFetch(query ? `${ROUTE_FAVORITES}?${query}` : ROUTE_FAVORITES);

	await throwApiError(response, getFavoritesErrorMessage(response.status));
	return response.json();
}

function fromSearchParams(searchParams: URLSearchParams): FavoritesListRequest {
	return {
		type: searchParams.get("type") ?? undefined,
		region: searchParams.get("region") ?? undefined,
		dateStart: searchParams.get("dateStart") ?? undefined,
		dateEnd: searchParams.get("dateEnd") ?? undefined,
		sortBy: (searchParams.get("sortBy") as FavoritesListRequest["sortBy"]) ?? undefined,
		sortOrder: (searchParams.get("sortOrder") as FavoritesListRequest["sortOrder"]) ?? undefined,
		cursor: searchParams.get("cursor") ?? undefined,
		size: toOptionalNumber(searchParams.get("size")),
	};
}
