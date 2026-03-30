export const MEETUP_TYPES = [
	{ value: "all", label: "전체" },
	{ value: "hobby", label: "취미/여가" },
	{ value: "study", label: "스터디" },
	{ value: "business", label: "비즈니스" },
	{ value: "health", label: "운동/건강" },
	{ value: "family", label: "가족/육아" },
	{ value: "etc", label: "기타" },
]; // TODO: 삭제 예정, category.store 로 변경 필요

export const QUERY_KEYS = {
	/** 모임 종류 */
	TYPE: "type",
	/** 모임 날짜 시작(ISO 형식, KST 시간대) */
	DATE_START: "dateStart",
	/** 모임 날짜 종료(ISO 형식, KST 시간대) */
	DATE_END: "dateEnd",
	/** 정렬 기준 */
	SORT_BY: "sort",
	/** 정렬 순서(오름차, 내림차) */
	SORT_ORDER: "order",
	/** 지역 */
	REGION: "region",
	/** 모임 날짜: TODO: 삭제 예정 */
	DATE: "date",
};

/** 정렬 기준 항목 */
export const SORT_BY_OPTIONS = [
	{ value: "dateTime", label: "모임 일시" },
	{ value: "registrationEnd", label: "마감 임박" },
	{ value: "participantCount", label: "참여인원순" },
];

/** 정렬 순서 항목 */
export const SORT_ORDER_OPTIONS = [
	{ value: "desc", label: "내림차순" },
	{ value: "asc", label: "오름차순" },
];

/** 기본 모임 타입 */
export const CATEGORY_TYPE_ALL = {
	id: "all", // 중복 방지를 위해 number 대신 string 사용
	name: "전체",
	description: "모든 모임 종류입니다.",
};
