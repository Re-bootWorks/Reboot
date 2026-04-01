export const QUERY_PARAM_KEYS = {
	TYPE: "type",
	REGION: "region",
	DATE_START: "dateStart",
	DATE_END: "dateEnd",
	REGISTRATION_END_START: "registrationEndStart",
	REGISTRATION_END_END: "registrationEndEnd",
	SORT_BY: "sortBy",
	SORT_ORDER: "sortOrder",
} as const;

/** 정렬 기준 항목 */
export const REVIEWS_SORT_BY_OPTIONS = [
	{ value: "createdAt", label: "작성일순" },
	{ value: "score", label: "점수순" },
	{ value: "participantCount", label: "참여인원순" },
];

/** 정렬 순서 항목 */
export const REVIEWS_SORT_ORDER_OPTIONS = [
	{ value: "desc", label: "내림차순" },
	{ value: "asc", label: "오름차순" },
];
