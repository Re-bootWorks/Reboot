import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const KOREAN_TIMEZONE = "Asia/Seoul";

// UI 표시용 "M월 D일"
export const uiFormatDate = (date: string | Date) => {
	return dayjs(date).tz(KOREAN_TIMEZONE).format("M월 D일");
};

// UI 표시용 "HH:mm"
export const uiFormatTime = (date: string | Date) => {
	return dayjs(date).tz(KOREAN_TIMEZONE).format("HH:mm");
};

// UI 표시용 "HH시"
export const uiFormatDeadline = (date: string | Date) => {
	const deadline = dayjs(date).tz(KOREAN_TIMEZONE);
	const now = dayjs().tz(KOREAN_TIMEZONE);
	const diffHours = deadline.diff(now, "hour");

	if (diffHours >= 24) {
		const diffDays = deadline.diff(now, "day");
		return `${diffDays}일 후 마감`;
	}

	return deadline.format("오늘 HH시 마감");
};

// 마감 기간 여부
export const isDeadlinePassed = (date: string | Date): boolean => {
	return dayjs().tz(KOREAN_TIMEZONE).isAfter(dayjs(date).tz(KOREAN_TIMEZONE));
};
