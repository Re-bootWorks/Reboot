import { clientFetch } from "@/libs/clientFetch";
import { throwApiError } from "@/utils/api";
import type { FavoritesListResponse, FavoritesListRequest } from "../types";
import {
	buildQuery,
	getFavoritesErrorMessage,
	toDateTimeRangeEnd,
	toDateTimeRangeStart,
} from "../utils";
import { ROUTE_FAVORITES } from "../constants/routes";

/** 찜 목록 조회 */
export async function getFavorites(
	params: FavoritesListRequest = {},
): Promise<FavoritesListResponse> {
	const query = buildQuery({
		type: params.type,
		region: params.region,
		dateStart: toDateTimeRangeStart(params.dateStart),
		dateEnd: toDateTimeRangeEnd(params.dateEnd),
		sortBy: params.sortBy,
		sortOrder: params.sortOrder,
		cursor: params.cursor,
		size: params.size,
	});

	const response = await clientFetch(query ? `${ROUTE_FAVORITES}?${query}` : ROUTE_FAVORITES);

	await throwApiError(response, getFavoritesErrorMessage(response.status));
	return response.json();
}
