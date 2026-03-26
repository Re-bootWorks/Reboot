import { isDeadlinePassed } from "@/utils/date";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "./constants";

/** 정렬 기준 항목 조회 */
export function getSortByItem(param: string | null) {
	return SORT_BY_OPTIONS.find((o) => o.value === param) ?? SORT_BY_OPTIONS[0];
}

/** 정렬 순서 항목 조회 */
export function getSortOrderItem(param: string | null) {
	return SORT_ORDER_OPTIONS.find((o) => o.value === param) ?? SORT_ORDER_OPTIONS[0];
}

/** 개설 확정 여부 체크 */
export function checkIsConfirmed(confirmedAt: string | null) {
	return confirmedAt !== null;
}

/** 모집 마감 여부 체크 */
export function checkIsRegClosed(
	registrationEnd: string,
	participantCount: number,
	capacity: number,
) {
	const isDead = isDeadlinePassed(registrationEnd);
	return isDead || participantCount >= capacity;
}
