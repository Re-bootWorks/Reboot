import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "./constants";

/** 정렬 기준 항목 조회 */
export function getSortByItem(param: string | null) {
	return SORT_BY_OPTIONS.find((o) => o.value === param) ?? SORT_BY_OPTIONS[0];
}

/** 정렬 순서 항목 조회 */
export function getSortOrderItem(param: string | null) {
	return SORT_ORDER_OPTIONS.find((o) => o.value === param) ?? SORT_ORDER_OPTIONS[0];
}
