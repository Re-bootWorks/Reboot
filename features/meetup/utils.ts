import dayjs from "dayjs";

export const MAX_NAME_LENGTH = 20;
export const MAX_ADDRESS_LENGTH = 50;
export const MIN_CONFIRMED_COUNT = 5;

/** 텍스트 유효성 검사 */
export function validateText(value: string) {
	return !!value.trim();
}

/** 모임 일시, 모집 마감 일시 유효성 검사
 * date: YYYY-MM-DD
 * time: HH:mm
 */
export function validateDateTime(date: string, time: string) {
	const isDateTimeValid = dayjs(`${date} ${time}`).isValid();
	const isAfterNow = dayjs(`${date} ${time}`).isAfter(dayjs());
	return isDateTimeValid && isAfterNow;
}

/** 모집 마감 일시 이후 모임 일시인지 유효성 검사
 * YYYY-MM-DD HH:mm
 */
type ValidateDateTimeOrderProps = {
	dateTime: { date: string; time: string };
	registrationEnd: { date: string; time: string };
};
export function validateDateTimeOrder({ dateTime, registrationEnd }: ValidateDateTimeOrderProps) {
	const dateTimeValue = dayjs(`${dateTime.date} ${dateTime.time}`);
	const registrationEndValue = dayjs(`${registrationEnd.date} ${registrationEnd.time}`);
	return dateTimeValue.isAfter(registrationEndValue);
}

/** 모집 정원 유효성 검사 */
export function validateCapacity(capacity: number) {
	return capacity >= MIN_CONFIRMED_COUNT;
}

/** 장소 검색 시 입력 값 유효성 검사 */
export function validatePlaceSearch(value: string) {
	const isCompletedText = /^[\uAC00-\uD7A3A-Za-z\s]*$/.test(value);
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
