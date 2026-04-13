export interface KakaoPlaceItem {
	address_name: string;
	category_group_code: string;
	category_group_name: string;
	category_name: string;
	distance: string;
	id: string;
	phone: string;
	place_name: string;
	place_url: string;
	road_address_name: string;
	x: string;
	y: string;
}

export interface KakaoPlaceMeta {
	is_end: boolean;
	pageable_count: number;
	same_name: {
		keyword: string;
		region: string[];
		selected_region: string;
	};
	total_count: number;
}

export interface KakaoPlaceResponse {
	documents: KakaoPlaceItem[];
	meta: KakaoPlaceMeta;
}

export interface ErrorResponse {
	code: string;
	message: string;
}

/** 모임 생성 요청 */
export interface MeetupCreateRequest {
	/** 모임 이름 */
	name: string;
	/** 모임 종류 */
	type: string;
	/** 모임 지역 */
	region: string;
	/** 모임 상세 주소 */
	address: string;
	/** 모임 장소 위도 */
	latitude: number;
	/** 모임 장소 경도 */
	longitude: number;
	/** 모임 일시 */
	dateTime: string;
	/** 모임 마감 일시 */
	registrationEnd: string;
	/** 모임 정원 */
	capacity: number;
	/** 모임 이미지 */
	image: string;
	/** 모임 설명 */
	description: string;
}

export interface Host {
	id: number;
	name: string;
	image: string;
}

/** 모임 생성 응답 */
export interface MeetupItemResponse {
	id: number;
	teamId: string;
	name: string;
	type: string;
	region: string;
	address: string;
	latitude: number;
	longitude: number;
	dateTime: string;
	registrationEnd: string;
	capacity: number;
	participantCount: number;
	image: string;
	description: string;
	canceledAt: string | null;
	confirmedAt: string | null;
	hostId: number;
	createdBy: number;
	createdAt: string;
	updatedAt: string;
	host: Host;
	isFavorited: boolean;
	isJoined: boolean;
	isCompleted: boolean;
}

/** 모임 목록 조회 요청 */
export type SortBy = "dateTime" | "registrationEnd" | "participantCount";
export type SortOrder = "asc" | "desc";
export interface MeetupListRequest {
	/** 모임 ID */
	id?: number;
	/** 모임 종류 */
	type?: string;
	/** 모임 지역 */
	region?: string;
	/** 모임 날짜 시작(ISO 형식, KST 시간대) */
	dateStart?: string;
	/** 모임 날짜 종료(ISO 형식, KST 시간대) */
	dateEnd?: string;
	/** 모임 호스트 사용자 ID */
	createdBy?: number;
	/** 모임 정렬 기준:
	 * dateTime(모임 일시)
	 * registrationEnd(모집 마감일)
	 * participantCount(참가자 수)
	 * @default "dateTime" */
	sortBy?: SortBy;
	/** 모임 정렬 순서:
	 * asc(오름차순)
	 * desc(내림차순)
	 * @default "asc" */
	sortOrder?: SortOrder;
	/** 다음 페이지를 위한 커서 */
	cursor?: string;
	/** 페이지 크기 @default 10 */
	size?: number;
}

/** 모임 목록 조회 항목 데이터 */
export interface MeetupItem {
	/** 모임 ID */
	id: number;
	/** 팀 ID */
	teamId: string;
	/** 모임 이름 */
	name: string;
	/** 모임 종류 */
	type: string;
	/** 모임 지역 */
	region: string;
	/** 모임 주소 */
	address: string;
	/** 모임 장소 위도 */
	latitude: number;
	/** 모임 장소 경도 */
	longitude: number;
	/** 모임 일시 */
	dateTime: string;
	/** 모집 마감 일시 */
	registrationEnd: string;
	/** 모임 정원 */
	capacity: number;
	/** 참여자 수 */
	participantCount: number;
	/** 모임 이미지 */
	image: string;
	/** 모임 설명 */
	description: string;
	/** 모임 취소 일시 */
	canceledAt: string | null;
	/** 모임 확정 일시 */
	confirmedAt: string | null;
	/** 모임 호스트 ID */
	hostId: number;
	/** 모임 생성자 ID */
	createdBy: number;
	/** 모임 생성 일시 */
	createdAt: string;
	/** 모임 수정 일시 */
	updatedAt: string;
	/** 모임 호스트 */
	host: Host;
	/** 사용자의 모임 찜 여부 */
	isFavorited: boolean;
	/** 사용자의 모임 참여 여부 */
	isJoined: boolean;
	/** 모임 완료 여부 */
	isCompleted: boolean;
}

/** 모임 목록 조회 항목 호스트 */
export interface Host {
	id: number;
	name: string;
	image: string;
}

/** 모임 목록 조회 응답 */
export interface MeetupListResponse {
	data: MeetupItem[];
	nextCursor: string;
	totalCount: number;
	currentOffset: number;
	limit: number;
	hasMore: boolean;
}

/** 특정 모임 선택 데이터 */
export type MeetupItemSelected =
	| (MeetupItem & {
			date: string;
			time: string;
	  })
	| null;
