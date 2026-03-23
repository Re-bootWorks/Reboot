import dayjs from "@/libs/dayjs";

const KOREAN_TIMEZONE = "Asia/Seoul";

// 한국 기준 오늘 날짜를 00:00:00으로 맞춘 Date 객체로 반환
export const getKoreanToday = () => {
	return dayjs().tz(KOREAN_TIMEZONE).startOf("day").toDate();
};

// Date 객체를 "YYYY-MM-DD" 문자열 반환
export const formatDateString = (date: Date) => {
	return dayjs(date).format("YYYY-MM-DD");
};

// "YYYY-MM-DD" 형식 문자열을 Date 객체로 변환
export const parseDateString = (value?: string) => {
	if (!value) return undefined;

	const parsed = dayjs(value, "YYYY-MM-DD", true);

	if (!parsed.isValid()) {
		return undefined;
	}

	return parsed.toDate();
};

// ISO 날짜 문자열을 "YYYY.MM.DD" 형식으로 반환
export const formatIsoDateWithDots = (value: string) => {
	return dayjs(value).tz(KOREAN_TIMEZONE).format("YYYY.MM.DD");
};

// YYYY-MM-DD HH:mm:ss 문자열을 ISOString 형식("2026-01-31T23:59:59.000Z")으로 변환
export const parseTimestamp = (date: string, time: string) => {
	if (!date || !time) {
		return undefined;
	}

	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return undefined;
	}

	let timeStr: string;
	if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
		timeStr = time;
	} else if (/^\d{2}:\d{2}$/.test(time)) {
		timeStr = `${time}:00`;
	} else {
		return undefined;
	}

	const dateTimeStr = `${date} ${timeStr}`;
	const parsed = dayjs.tz(dateTimeStr, "YYYY-MM-DD HH:mm:ss", KOREAN_TIMEZONE);

	if (!parsed.isValid()) {
		return undefined;
	}
	const asDate = parsed.toDate();
	if (isNaN(asDate.getTime())) {
		return undefined;
	}

	return parsed.toISOString();
};
