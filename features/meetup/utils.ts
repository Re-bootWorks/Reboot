import { MAX_ADDRESS_LENGTH, MAX_NAME_LENGTH, MIN_CONFIRMED_COUNT } from "./constants";
export { MAX_ADDRESS_LENGTH, MAX_NAME_LENGTH, MIN_CONFIRMED_COUNT };

// meetupDetail/edit/utils: validateDateTimeIsFuture, validateDateTimeOrder, validateMaxCapacity

/** 텍스트 유효성 검사 */
export function validateText(value: string) {
	return !!value.trim();
}

/** 모임 이름 유효성 검사 */
export function validateName(value: string) {
	return validateText(value) && value.length <= MAX_NAME_LENGTH;
}

/** 주소 상세 유효성 검사 */
export function validateAddressDetail(value: string) {
	return validateText(value) && value.length <= MAX_ADDRESS_LENGTH;
}

/** 모집 정원 유효성 검사(최소 인원 검증 제외) */
export function validateCapacity(capacity: number | string | null | undefined): boolean {
	if (capacity === null || capacity === undefined) return false;

	const n = Number(capacity);
	if (n <= 0 || !Number.isInteger(n) || !Number.isFinite(n)) return false;
	return true;
}

/** 장소 검색 시 입력 값 유효성 검사 */
export function validatePlaceSearch(value: string) {
	const isCompletedText = /^[\uAC00-\uD7A3A-Za-z0-9\s]*$/.test(value);
	if (!isCompletedText) return false;
	return true;
}

/** 선택된 주소의 region 변환 */
/**
 * 앞부분 (| 기준 왼쪽) — 지번 주소 매칭
 * "읍/면/동/가/리"로 끝나는 행정구역명(예: 역삼동, 신사동)을 찾고, 뒤에 붙는 번지("산 123" 등)도 함께 포함
 * 뒷부분 (| 기준 오른쪽) — 도로명 주소 매칭
 * "로" 또는 "길"로 끝나는 도로명(예: 테헤란로, 봉은사길) 포함
 */
const DONG_REGEX =
	/(([가-힣]+(\d|\d[,\.]\d|)+(읍|면|동|가|리))(?=[\s\d]|$)([^구\s]|)((\d(~|-)\d|\d)(가|리)|))([ ](산[ ]?\d+([~-]\d+)?))?|(([가-힣]|(\d(~|-)\d)|\d)+(로|길))(?=[\s\d]|$)/;
export function getRegion(text: string) {
	text = text
		.replace(/특별자치시|특별자치도/g, "")
		.replace(/\s+/g, " ")
		.trim();
	const dong = text.match(DONG_REGEX);
	if (!dong) return text.trim();
	// 매칭되는 문자열 전까지 반환
	const prefix = text.substring(0, dong.index).trim();
	if (!prefix) return text.trim();
	// 예외: 세종시 주소는 동까지 처리(필요할 경우 주석 해제)
	// if (/세종/.test(prefix)) {
	// 	return (prefix + " " + dong[0]).trim();
	// }
	return prefix;
}

/** addressName, addressDetail를 address로 통합 */
export function getAddress(name: string, detail: string) {
	return `${name}, ${detail}`;
}

/** address를 addressName, addressDetail로 분리 */
export function splitAddress(address: string) {
	const [addressName, addressDetail] = address.split(", ");
	return { addressName, addressDetail };
}
