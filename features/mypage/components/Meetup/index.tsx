"use client";
import { useState } from "react";
import DetailCard from "../DetailCard";
import { DetailCardAction, DetailCardBadge } from "../DetailCard/type";
import ReviewFormModal, { ReviewFormValues } from "../ReviewFormModal";
import { MeetupItem, MeetupList } from "@/features/mypage/type";
import { mockMyMeetups } from "../../mockData";
import AlertModal from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/features/mypage/hooks/useMeetingFavorite";

interface MeetupActionHandlers {
	/** 모임 확정 */
	onConfirmMeetup: () => void;
	/** 모임 삭제 */
	onDeleteMeetup: () => void;
	/** 모임 취소 */
	onCancelMeetup: () => void;
	/** 모임 예약 취소 */
	onCancelReservation: () => void;
	/** 모임 리뷰 작성 */
	onWriteReview: () => void;
}

type AlertAction = "confirm" | "delete" | "cancelMeetup" | "cancelReservation";

const ALERT_MESSAGE = {
	confirm: "모임을 확정하시겠습니까?",
	delete: "모임을 삭제하시겠습니까?",
	cancelMeetup: "모임 취소하시겠습니까?",
	cancelReservation: "모임 예약을 취소하시겠습니까?",
} satisfies Record<AlertAction, string>;

// 모임 배지 상태
function meetupBadges(item: MeetupItem): DetailCardBadge[] {
	if (item.isCompleted) {
		if (item.isReviewed)
			return [
				{ label: "이용 완료", variant: "completed" },
				{ label: "리뷰 작성완료", variant: "completedAlt" },
			];
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

// 모임 상태별 액션
function meetupActions(
	item: MeetupItem,
	userId: number,
	handlers: MeetupActionHandlers,
): DetailCardAction[] {
	const isHost = userId === item.hostId;

	if (item.isCompleted) {
		if (item.isReviewed) return [];
		return [
			{
				label: "리뷰 작성하기",
				variant: "purple",
				handleCardButtonClick: handlers.onWriteReview,
			},
		];
	}

	if (isHost) {
		if (item.confirmedAt) {
			return [
				{
					label: "모임 삭제하기",
					variant: "grayBorder",
					handleCardButtonClick: handlers.onDeleteMeetup,
					isDestructive: true,
				},
				{
					label: "모임 취소하기",
					variant: "purpleBorder",
					handleCardButtonClick: handlers.onCancelMeetup,
				},
			];
		}
		return [
			{
				label: "모임 삭제하기",
				variant: "grayBorder",
				handleCardButtonClick: handlers.onDeleteMeetup,
				isDestructive: true,
			},
			{
				label: "모임 확정하기",
				variant: "purple",
				handleCardButtonClick: handlers.onConfirmMeetup,
			},
		];
	}

	return [
		{
			label: "예약 취소하기",
			variant: "purpleBorder",
			handleCardButtonClick: handlers.onCancelReservation,
		},
	];
}

export default function Meetup() {
	const initialMeetups: MeetupList = mockMyMeetups;

	// @TODO 추후 zustand로 변경
	const userId = 1333;
	const [items, setItems] = useState(initialMeetups);
	const { handleWishToggle } = useMeetingFavorite(setItems);
	const [reviewTarget, setReviewTarget] = useState<MeetupItem | null>(null);
	const [alertTarget, setAlertTarget] = useState<MeetupItem | null>(null);
	const [alertAction, setAlertAction] = useState<AlertAction | null>(null);

	// alert modal 닫기
	function closeAlert() {
		setAlertTarget(null);
		setAlertAction(null);
	}

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
	}

	// DetailCard 버튼 핸들러
	function meetupActionHandlers(item: MeetupItem): MeetupActionHandlers {
		return {
			// 모임 확정하기
			onConfirmMeetup() {
				setAlertTarget(item);
				setAlertAction("confirm");
			},
			// 모임 삭제하기
			onDeleteMeetup() {
				setAlertTarget(item);
				setAlertAction("delete");
			},
			// 모임 취소하기
			onCancelMeetup() {
				setAlertTarget(item);
				setAlertAction("cancelMeetup");
			},
			// 예약 취소하기
			onCancelReservation() {
				setAlertTarget(item);
				setAlertAction("cancelReservation");
			},
			// 리뷰 작성하기
			onWriteReview() {
				setReviewTarget(item);
			},
		};
	}

	// Alert 확인 시
	async function handleAlertConfirm() {
		if (!alertTarget || !alertAction) return;

		const actionHandlers: Record<AlertAction, () => void> = {
			confirm: () => console.log("모임 확정 API", alertTarget.id),
			delete: () => console.log("모임 삭제 API", alertTarget.id),
			cancelMeetup: () => console.log("모임 취소 API", alertTarget.id),
			cancelReservation: () => console.log("모임 예약 취소 API", alertTarget.id),
		};

		actionHandlers[alertAction]();
	}
	// 리뷰 제출 시
	async function handleReviewSubmit(reviewFormValues: ReviewFormValues) {
		if (!reviewTarget) return;
		console.log("리뷰 작성 API", reviewTarget.id, reviewFormValues);

		closeReviewModal();
	}

	return (
		<>
			<ul className="mt-6 flex flex-col gap-4 lg:mt-8 lg:gap-6">
				{items.map((item) => {
					const handlers = meetupActionHandlers(item);

					return (
						<DetailCard
							key={item.id}
							item={item}
							badges={meetupBadges(item)}
							actions={meetupActions(item, userId, handlers)}
							wishAction={{
								isWished: item.isFavorited,
								isPending: false,
								handleWishClick: () => handleWishToggle(item.id),
							}}
						/>
					);
				})}
			</ul>
			<AlertModal
				isOpen={!!alertTarget}
				onClose={closeAlert}
				handleConfirmButton={handleAlertConfirm}>
				{alertAction ? ALERT_MESSAGE[alertAction] : ""}
				{alertAction === "cancelMeetup" && (
					<>
						<br />
						재확정이 불가능 합니다.
					</>
				)}
			</AlertModal>

			<ReviewFormModal
				mode="create"
				isOpen={!!reviewTarget}
				onClose={closeReviewModal}
				handleFormSubmit={handleReviewSubmit}
			/>
		</>
	);
}
