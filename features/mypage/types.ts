import { ReviewScore } from "@/types/common";

/* ------- api type ------- */
export interface CursorPageResponse<T> {
	data: T;
	nextCursor: string | null;
	hasMore: boolean;
}

interface Host {
	id: number;
	name: string;
	image: string;
}

export type Role = "participant" | "host";

// 참여한 모임목록 전체 (작성하지 않은 리뷰에 사용)
export interface MeetingJoinedApiRes {
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
	image: string | null;
	description: string;
	canceledAt: null | string;
	confirmedAt: null | string;
	hostId: number;
	createdBy: number;
	createdAt: string;
	updatedAt: string;
	host: Host;
	isFavorited: boolean;
	isCompleted: boolean;
	joinedAt: string;
	isReviewed: boolean;
}
// 작성한 리뷰 목록
export interface MeReviewsApiRes {
	id: number;
	score: number;
	comment: string;
	meetingId: number;
	meeting: {
		id: number;
		type: string;
		name: string;
		image: string | null;
		dateTime: string;
	};
	createdAt: string;
}

// 내가 참여한 모임 목록, 내가 만든 모임 목록
export type MeMeetingApiRes = MeetingJoinedApiRes & {
	role: Role;
};

export type MeetingStatus = "CONFIRMED" | "CANCELED";

export type PatchMeetingStatusParams = {
	meetingId: number;
	status: MeetingStatus;
};

export interface ReviewPayload {
	score: number;
	comment: string;
}

export interface PostReviewPayload {
	meetingId: number;
	reviewFormValues: ReviewPayload;
}

export interface PatchReviewPayload {
	reviewId: number;
	reviewFormValues: ReviewPayload;
}

export interface PatchUserProfilePayload {
	name?: string;
	email?: string;
	image?: string;
}

/* ------- component ------- */
export interface UserProfile {
	id: number;
	email: string;
	name: string;
	image: string | null;
}

export interface DetailCardItem {
	id: number;
	name: string;
	region: string;
	dateTime: string;
	capacity: number;
	participantCount: number;
	image: string | null;
	isFavorited: boolean;
}
export interface DetailCardBadge {
	label: string;
	variant: "scheduled" | "confirmed" | "pending" | "completed" | "completedAlt";
	showStatusLabel?: boolean;
}

export interface DetailCardAction {
	label: string;
	variant?: "purple" | "purpleBorder" | "grayBorder";
	isDestructive?: boolean;
	handleCardButtonClick: () => void;
}

export interface DetailCardWishAction {
	isWished?: boolean;
	isPending?: boolean;
	handleWishClick: () => void;
}

export interface DetailCardProps {
	item: DetailCardItem;
	badges?: DetailCardBadge[];
	actions?: DetailCardAction[];
	wishAction?: DetailCardWishAction;
}

export type ReviewCardItem = Omit<MeReviewsApiRes, "score" | "createdAt" | "meeting"> & {
	score: ReviewScore;
	meetingType: string;
	meetingName: string;
	meetingImage: string | null;
	meetingDateTime: string;
};

export interface ReviewCardProps {
	user: UserProfile;
	item: ReviewCardItem;
	handleEdit: () => void;
	handleDelete: () => void;
}

export type ReviewList = ReviewCardItem[];

/* ------- tab ------- */
export interface MeetupItem extends DetailCardItem {
	registrationEnd: string;
	canceledAt: string | null;
	confirmedAt: string | null;
	hostId: number;
	isReviewed: boolean;
	isCompleted: boolean;
}
export type MeetupList = MeetupItem[];
export interface MeetupDetailItem extends MeetupItem {
	role: Role;
}
export type MeetupDetailList = MeetupDetailItem[];

export type WritableReviewItem = DetailCardItem;
export type WritableReviewList = WritableReviewItem[];
