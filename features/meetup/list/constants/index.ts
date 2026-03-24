export const MEETUP_TYPES = [
	{ value: "all", label: "전체" },
	{ value: "hobby", label: "취미/여가" },
	{ value: "study", label: "스터디" },
	{ value: "business", label: "비즈니스" },
	{ value: "health", label: "운동/건강" },
	{ value: "family", label: "가족/육아" },
	{ value: "etc", label: "기타" },
];

export const QUERY_KEYS = {
	/** 모임 종류 */
	TYPE: "type",
	/** 현재 페이지 */
	PAGE: "p",
	/** 정렬 기준 */
	SORT_BY: "sort",
	/** 정렬 순서(오름차, 내림차) */
	SORT_ORDER: "order",
	/** 지역 */
	REGION: "region",
	/** 모임 날짜 */
	DATE: "date",
};

export const SORT_BY_OPTIONS = [
	{ value: "dateTime", label: "모임 일시" },
	{ value: "registrationEnd", label: "마감 임박" },
	{ value: "participantCount", label: "참여인원순" },
];

export const SORT_ORDER_OPTIONS = [
	{ value: "asc", label: "오름차순" },
	{ value: "desc", label: "내림차순" },
];
