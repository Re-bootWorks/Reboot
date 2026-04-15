export type FavoriteSortBy =
	| "createdAt"
	| "meetingCreatedAt"
	| "dateTime"
	| "registrationEnd"
	| "participantCount";

export type FavoriteSortOrder = "asc" | "desc";

export interface FavoriteParams {
	/** 모임 종류 */
	type?: string;
	/** 모임 지역 */
	region?: string;
	/** 모임 시작 범위 (이상, ISO 8601) */
	dateStart?: string;
	/** 모임 끝 범위 (이하, ISO 8601) */
	dateEnd?: string;

	/** 정렬 기준 */
	sortBy?: FavoriteSortBy;
	/** 정렬 순서 */
	sortOrder?: FavoriteSortOrder;
}

export interface FavoritesListRequest extends FavoriteParams {
	/** 다음 페이지를 위한 커서 */
	cursor?: string;
	/** 페이지 크기 */
	size?: number;
}

export type FavoriteMeetingsListKeyParams = Omit<FavoritesListRequest, "cursor">;

export interface FavoriteMeetingHost {
	id: number;
	name: string;
	image: string | null;
}

export interface FavoriteMeetingSummary {
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
	createdAt: string;
	updatedAt: string;
	host: FavoriteMeetingHost;
	isCompleted: boolean;
	isJoined: boolean;
}

export interface FavoriteMeeting {
	/** 찜 ID */
	id: number;
	meetingId: number;
	userId: number;
	/** 찜한 시각 */
	createdAt: string;
	meeting: FavoriteMeetingSummary;
}

export interface FavoritesListResponse {
	data: FavoriteMeeting[];
	nextCursor: string | null;
	hasMore: boolean;
}

export interface FavoriteCardItem {
	id: FavoriteMeeting["id"];
	meetingId: FavoriteMeeting["meetingId"];
	userId: FavoriteMeeting["userId"];

	meetingName: FavoriteMeeting["meeting"]["name"];
	meetingType: FavoriteMeeting["meeting"]["type"];
	meetingRegion: FavoriteMeeting["meeting"]["region"];
	meetingAddress: FavoriteMeeting["meeting"]["address"];
	meetingImage: FavoriteMeeting["meeting"]["image"];
	meetingDateTime: FavoriteMeeting["meeting"]["dateTime"];
	registrationEnd: FavoriteMeeting["meeting"]["registrationEnd"];
	capacity: FavoriteMeeting["meeting"]["capacity"];
	participantCount: FavoriteMeeting["meeting"]["participantCount"];
	isCompleted: FavoriteMeeting["meeting"]["isCompleted"];
	isJoined: FavoriteMeeting["meeting"]["isJoined"];
	confirmedAt: FavoriteMeeting["meeting"]["confirmedAt"];
}

export type FavoriteCardItemSelected =
	| (FavoriteCardItem & {
			date: string;
			time: string;
	  })
	| null;
