export interface RatingSummaryResponse {
	averageScore: number;
	totalReviews: number;
	oneStar: number;
	twoStars: number;
	threeStars: number;
	fourStars: number;
	fiveStars: number;
}

export interface ReviewCategoryStatisticsItem extends RatingSummaryResponse {
	type: string;
}

export type ReviewCategoryStatistics = ReviewCategoryStatisticsItem[];

export type SortBy = "dateTime" | "registrationEnd" | "participantCount";
export type SortOrder = "asc" | "desc";

export interface ReviewsFilterQueryParams {
	/** 모임 종류 */
	type?: string;
	/** 모임 지역 */
	region?: string;
	/** 모임 시작 범위 (이상, ISO 8601) */
	dateStart?: string;
	/** 모임 끝 범위 (이하, ISO 8601) */
	dateEnd?: string;
	/** 모집 마감 시작 범위 (이상, ISO 8601) */
	registrationEndStart?: string;
	/** 모집 마감 끝 범위 (이하, ISO 8601) */
	registrationEndEnd?: string;

	/** 정렬 기준 */
	sortBy?: SortBy;
	/** 정렬 순서 */
	sortOrder?: SortOrder;
}

export interface ReviewsListRequest extends ReviewsFilterQueryParams {
	/** 다음 페이지를 위한 커서 */
	cursor?: string;
	/** 페이지 크기 */
	size?: number;
}

export type ReviewsListKeyParams = Omit<ReviewsListRequest, "cursor">;

export interface ReviewCardProps {
	id: ReviewsListItem["id"];
	meetingId: ReviewsListItem["meetingId"];
	meetingImage: ReviewsListItem["meeting"]["image"];
	score: ReviewsListItem["score"];
	userImage: ReviewsListItem["user"]["image"];
	userName: ReviewsListItem["user"]["name"];
	createdAt: ReviewsListItem["createdAt"];
	comment: ReviewsListItem["comment"];
	meetingName: ReviewsListItem["meeting"]["name"];
	meetingType: ReviewsListItem["meeting"]["type"];
	userId: ReviewsListItem["userId"];
}

export interface ReviewsListItem {
	id: number;
	meetingId: number;
	userId: number;
	score: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user: {
		id: number;
		name: string;
		image: string | null;
	};
	meeting: {
		id: number;
		name: string;
		type: string;
		region: string;
		image: string;
		dateTime: string;
	};
}

export interface ReviewsListResponse {
	data: ReviewsListItem[];
	nextCursor: string | null;
	hasMore: boolean;
}
