import { DetailCardAction, DetailCardBadge, MeetupDetailItem } from "./types";

export interface HostMeetupActionHandlers {
	/** 모임 확정 */
	onConfirmMeetup: () => void;
	/** 모임 삭제 */
	onDeleteMeetup: () => void;
	/** 모임 취소 */
	onCancelMeetup: () => void;
	/** 모임 리뷰 작성 */

	onWriteReview: () => void;
}

export interface ParticipantMeetupActionHandlers {
	/** 모임 참여 취소 */
	onCancelReservation: () => void;
	onWriteReview: () => void;
}

export type MeetupActionHandlers = HostMeetupActionHandlers & ParticipantMeetupActionHandlers;

export type HostAlertActionType = "confirm" | "delete" | "cancelMeetup";

export type AlertActionType = HostAlertActionType | "cancelReservation";

// alert 메세지
export const ALERT_MESSAGE = {
	confirm: "모임을 확정하시겠습니까?",
	delete: "모임을 삭제하시겠습니까?",
	cancelMeetup: "모임을 취소하시겠습니까?",
	cancelReservation: "모임 예약을 취소하시겠습니까?",
} satisfies Record<AlertActionType, string>;

export function confirmMeetupAction(handlers: HostMeetupActionHandlers): DetailCardAction {
	return {
		label: "모임 확정하기",
		handleCardButtonClick: handlers.onConfirmMeetup,
	};
}

export function cancelMeetupAction(handlers: HostMeetupActionHandlers): DetailCardAction {
	return {
		label: "모임 취소하기",
		handleCardButtonClick: handlers.onCancelMeetup,
	};
}

export function deleteMeetupAction(handlers: HostMeetupActionHandlers): DetailCardAction {
	return {
		label: "모임 삭제하기",
		handleCardButtonClick: handlers.onDeleteMeetup,
		isDestructive: true,
	};
}

export function cancelReservationAction(
	handlers: ParticipantMeetupActionHandlers,
): DetailCardAction {
	return {
		label: "참여 취소하기",
		variant: "purpleBorder",
		handleCardButtonClick: handlers.onCancelReservation,
	};
}

export function writeReviewAction(
	handlers: HostMeetupActionHandlers | ParticipantMeetupActionHandlers,
): DetailCardAction {
	return {
		label: "리뷰 작성하기",
		variant: "purple",
		handleCardButtonClick: handlers.onWriteReview,
	};
}
// 주최자 액션버튼
export function getHostMeetupActions(
	item: MeetupDetailItem,
	handlers: HostMeetupActionHandlers,
): DetailCardAction[] {
	if (item.canceledAt) return [deleteMeetupAction(handlers)];

	if (item.isCompleted) {
		if (item.isReviewed) return [deleteMeetupAction(handlers)];

		return [writeReviewAction(handlers), deleteMeetupAction(handlers)];
	}

	if (item.confirmedAt) {
		return [cancelMeetupAction(handlers), deleteMeetupAction(handlers)];
	}

	return [
		confirmMeetupAction(handlers),
		cancelMeetupAction(handlers),
		deleteMeetupAction(handlers),
	];
}
// 참여자 액션버튼
export function getParticipantMeetupActions(
	item: MeetupDetailItem,
	handlers: ParticipantMeetupActionHandlers,
): DetailCardAction[] {
	if (item.canceledAt) return [];

	if (item.isCompleted) {
		if (item.isReviewed) return [];

		return [writeReviewAction(handlers)];
	}

	return [cancelReservationAction(handlers)];
}

// 모임 상태별 액션
export function meetupActions(
	item: MeetupDetailItem,
	handlers: MeetupActionHandlers,
): DetailCardAction[] {
	return item.role === "host"
		? getHostMeetupActions(item, handlers)
		: getParticipantMeetupActions(item, handlers);
}

// 모임 배지 상태
export function meetupBadges(item: MeetupDetailItem): DetailCardBadge[] {
	if (item.canceledAt) {
		return [{ label: "개설 취소", variant: "completedAlt" }];
	}
	if (item.isCompleted) {
		if (item.isReviewed) return [{ label: "리뷰 작성완료", variant: "reviewed" }];
		return [{ label: "이용 완료", variant: "completed" }];
	}

	if (item.confirmedAt) {
		return [
			{ label: "이용 예정", variant: "scheduled" },
			{ label: "개설확정", variant: "confirmed", showStatusLabel: true },
		];
	}

	return [
		{ label: "이용 예정", variant: "scheduled" },
		{ label: "개설 대기", variant: "pending" },
	];
}
