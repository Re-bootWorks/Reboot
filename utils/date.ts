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
