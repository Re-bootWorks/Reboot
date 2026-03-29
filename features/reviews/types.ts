export interface RatingSummaryResponse {
	averageScore: number;
	totalReviews: number;
	oneStar: number;
	twoStars: number;
	threeStars: number;
	fourStars: number;
	fiveStars: number;
}

export interface ReviewCategoryStatisticsItem extends Pick<
	RatingSummaryResponse,
	"averageScore" | "totalReviews"
> {
	type: string;
}

export type ReviewCategoryStatistics = ReviewCategoryStatisticsItem[];

export type ReviewsSortBy = "dateTime" | "registrationEnd" | "participantCount";
export type ReviewsSortOrder = "asc" | "desc";

export interface ReviewsListRequest {
	/** 모임 종류 */
	type?: string;
	/** 모임 지역 */
	region?: string;
	/** 모임 날짜 */
	date?: string;
	/** 정렬 기준 */
	sortBy?: ReviewsSortBy;
	/** 정렬 순서 */
	sortOrder?: ReviewsSortOrder;
	/** 다음 페이지를 위한 커서 */
	cursor?: string;
	/** 페이지 크기 */
	size?: number;
}

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
