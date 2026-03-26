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
const DONG_REGEX =
	/(([가-힣]+(\d|\d[,\.]\d|)+(읍|면|동|가|리))(?=[\s\d]|$)([^구\s]|)((\d(~|-)\d|\d)(가|리)|))([ ](산[ ]?\d+([~-]\d+)?))?|(([가-힣]|(\d(~|-)\d)|\d)+(로|길))(?=[\s\d]|$)/;
export function getRegion(text: string) {
	const dong = text.match(DONG_REGEX);
	if (!dong) return text.trim();
	const prefix = text.substring(0, dong.index).trim();
	if (!prefix) return text.trim();
	// 세종시 주소 예외 처리
	if (/세종/.test(prefix)) {
		return (prefix + " " + dong[0]).trim();
	}
	return prefix;
}

/** 주소 address 반환 */
export function getAddress(name: string, detail: string) {
	return `${name}, ${detail}`;
}
