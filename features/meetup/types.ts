// 카카오 장소 검색: 키워드로 장소 검색
export type getKakaoPlaceFn = (query: string) => Promise<KakaoPlaceItem[]>;

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
	/** 모임 날짜 */
	date?: string;
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

/** 모임 목록 조회 응답 */
export interface MeetupListResponse {
	data: MeetupItemResponse[];
	nextCursor: string;
	hasMore: boolean;
}
