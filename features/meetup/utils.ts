import { RegionFilterValue } from "./list/components/ListFilters";

/** 텍스트 유효성 검사 */
export function validateText(value: string) {
	return !!value.trim();
}

/** 모임 일시, 모집 마감 일시 유효성 검사 */
export function validateDateTime(date: string, time: string) {
	return !!(date && time);
}

/** 모집 정원 유효성 검사 */
export function validateCapacity(capacity: number) {
	return capacity > 0;
}

/** 장소 검색 시 입력 값 유효성 검사 */
export function validatePlaceSearch(value: string) {
	const isCompletedText = /^[\uAC00-\uD7A3|A-Z|a-z|\s]*$/.test(value);
	if (!isCompletedText) return false;
	return true;
}

/** 주소 region 반환 */
/**
 * 앞부분 (| 기준 왼쪽) — 지번 주소 매칭
 * "읍/면/동/가/리"로 끝나는 행정구역명(예: 역삼동, 신사동)을 찾고, 뒤에 붙는 번지("산 123" 등)도 함께 포함
 * 뒷부분 (| 기준 오른쪽) — 도로명 주소 매칭
 * "로" 또는 "길"로 끝나는 도로명(예: 테헤란로, 봉은사길) 포함
 */
const DONG_REGEX =
	/(([가-힣]+(\d|\d[,\.]\d|)+(읍|면|동|가|리))(?=[\s\d]|$)([^구\s]|)((\d(~|-)\d|\d)(가|리)|))([ ](산[ ]?\d+([~-]\d+)?))?|(([가-힣]|(\d(~|-)\d)|\d)+(로|길))(?=[\s\d]|$)/;
export function getRegion(text: string) {
	const dong = text.match(DONG_REGEX);
	if (!dong) return text.trim();
	// 매칭되는 문자열 전까지 반환
	const prefix = text.substring(0, dong.index).trim();
	if (!prefix) return text.trim();
	// 세종시 주소 예외 처리
	// if (/세종/.test(prefix)) {
	// 	return (prefix + " " + dong[0]).trim();
	// }
	return prefix;
}

/** 주소 address 반환 */
export function getAddress(name: string, detail: string) {
	return `${name}, ${detail}`;
}

/** 주소 address 를 addressName, addressDetail 로 분리 */
export function splitAddress(address: string) {
	const [addressName, addressDetail] = address.split(", ");
	return { addressName, addressDetail };
}

/** 모임 종류 쿼리 값 -> 요청 파라미터 변환 */
export function transformTypeValue(data: string | null | undefined): string | undefined {
	return !!data && data !== "all" ? data : undefined;
}

/** 기타 쿼리 값 -> 요청 파라미터 변환 */
export function transformQueryValue<T extends string>(data: T | null | undefined): T | undefined {
	return !!data ? data : undefined;
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
