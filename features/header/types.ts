/* ------- api ------- */

export interface CursorPageResponse<T> {
	data: T;
	nextCursor: string | null;
	hasMore: boolean;
}

export interface GNBCount {
	count: number;
}

interface NotificationBase {
	id: number;
	teamId: string;
	userId: number;
	message: string;
	isRead: boolean;
	createdAt: string;
}
// 모임 확정, 취소시
export interface MeetingNotificationRes extends NotificationBase {
	type: "MEETING_CONFIRMED" | "MEETING_CANCELED";
	data: {
		image: string | null;
		meetingId: number;
		meetingName: string;
	};
}

// 댓글 작성 시
export interface CommentNotificationRes extends NotificationBase {
	type: "COMMENT";
	data: {
		image: string | null;
		postId: number;
		postTitle: string;
		commentId: number;
	};
}

// 알림 응답 타입
export type NotificationRes = MeetingNotificationRes | CommentNotificationRes;

// 알림 타입
export type NotificationType = "MEETING_CONFIRMED" | "MEETING_CANCELED" | "COMMENT";

/* ------- component ------- */

interface NotificationCardBase {
	id: number;
	message: string;
	image: string | null;
	isRead: boolean;
	createdAt: string;
}
export interface MeetingNotificationCardItem extends NotificationCardBase {
	type: "MEETING_CONFIRMED" | "MEETING_CANCELED";
	meetingId: number;
	meetingName: string;
}

export interface CommentNotificationCardItem extends NotificationCardBase {
	type: "COMMENT";
	postId: number;
	postTitle: string;
	commentId: number;
}
export interface UnknownNotificationCardItem extends NotificationCardBase {
	type: string;
}

export type NotificationCardItem =
	| MeetingNotificationCardItem
	| CommentNotificationCardItem
	| UnknownNotificationCardItem;

export type NotificationCardList = NotificationCardItem[];
