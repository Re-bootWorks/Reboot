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

/** 지역 추출 (서울 강남구) */
export function getRegion(first: string, second: string) {
	return `${first} ${second}`;
}

/** 도로명 주소 통합 */
export function getAddress(name: string, detail: string) {
	return `${name}, ${detail}`;
}

/** 위경도 소수점 4자리로 변환 */
export function formatLatLng(value: number | string) {
	if (typeof value === "string") {
		value = Number(value);
	}
	return Number(value.toFixed(4));
}
