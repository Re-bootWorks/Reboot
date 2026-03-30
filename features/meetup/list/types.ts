export interface Host {
	id: number;
	name: string;
	image: string;
}

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

export interface MeetupListResponse {
	data: MeetupItem[];
	nextCursor: string;
	hasMore: boolean;
}
