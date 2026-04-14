export const QUERY_KEYS = {
	/** 모임 종류 */
	TYPE: "type",
	/** 검색 키워드 */
	KEYWORD: "keyword",
	/** 모임 날짜 시작(ISO 형식, KST 시간대) */
	DATE_START: "dateStart",
	/** 모임 날짜 종료(ISO 형식, KST 시간대) */
	DATE_END: "dateEnd",
	/** 지역 */
	REGION: "region",
	/** 정렬 기준
	 * 클라이언트 기본값 createdAt
	 * 서버 기본값 dateTime
	 */
	SORT_BY: "sort",
	/** 정렬 순서 (오름차, 내림차)
	 * 클라이언트 기본값 desc, 서버 기본값 asc
	 * sortBy=createAt의 경우 서버 기본값 desc
	 */
	SORT_ORDER: "order",
};

/** 정렬 기준 항목 */
export const SORT_BY_OPTIONS = [
	{ value: "createdAt", label: "생성날짜순" },
	{ value: "dateTime", label: "모임날짜순" },
	{ value: "registrationEnd", label: "마감임박순" },
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
