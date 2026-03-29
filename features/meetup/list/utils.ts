import { isDeadlinePassed } from "@/utils/date";
import { SortBy, SortOrder } from "../types";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "./constants";
import { RegionFilterValue } from "../list/components/ListFilters";

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

/** 모임 종류 쿼리 값 -> 요청 파라미터 변환 */
export function transformTypeValue(data: string | null | undefined): string | undefined {
	return !!data && data !== "all" ? data : undefined;
}

/** 기타 쿼리 값 -> 요청 파라미터 변환 */
export function transformQueryValue<T extends string>(data: T | null | undefined): T | undefined {
	return !!data ? data : undefined;
}

/** 정렬 기준 쿼리 → API 파라미터 */
const SORT_BY_VALUES = ["dateTime", "registrationEnd", "participantCount"];
export function transformSortByQuery(value: string | null | undefined): SortBy | undefined {
	if (value && SORT_BY_VALUES.includes(value)) {
		return value as SortBy;
	} else return undefined;
}

/** 정렬 순서 쿼리 → API 파라미터 */
const SORT_ORDER_VALUES = ["asc", "desc"];
export function transformSortOrderQuery(value: string | null | undefined): SortOrder | undefined {
	if (value && SORT_ORDER_VALUES.includes(value)) {
		return value as SortOrder;
	} else return undefined;
}

/** 지역 (region) 쿼리 값 -> dropdown 데이터로 변환 */
export function transformRegionData(data: string | null | undefined): RegionFilterValue {
	if (!data) {
		return {
			region: null,
			district: null,
		};
	} else {
		const [region, district] = data.split(" ");
		return {
			region: { value: region, label: region },
			district: { value: district, label: district },
		};
	}
}
