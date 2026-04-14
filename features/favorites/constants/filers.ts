import type { FavoriteSortBy, FavoriteSortOrder } from "../types";

export const QUERY_PARAM_KEYS = {
	TYPE: "type",
	REGION: "region",
	DATE_START: "dateStart",
	DATE_END: "dateEnd",
	SORT_BY: "sortBy",
	SORT_ORDER: "sortOrder",
} as const;

/** 정렬 기준 항목 */

export const FAVORITES_SORT_BY_OPTIONS: Array<{ value: FavoriteSortBy; label: string }> = [
	{ value: "createdAt", label: "찜한순" },
	{ value: "meetingCreatedAt", label: "모임 생성순" },
	{ value: "dateTime", label: "모임 날짜순" },
	{ value: "registrationEnd", label: "마감 임박순" },
	{ value: "participantCount", label: "참여 인원순" },
];

/** 정렬 순서 항목 */
export const FAVORITES_SORT_ORDER_OPTIONS: Array<{
	value: FavoriteSortOrder;
	label: string;
}> = [
	{ value: "desc", label: "내림차순" },
	{ value: "asc", label: "오름차순" },
];
