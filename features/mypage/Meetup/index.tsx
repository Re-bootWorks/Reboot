"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import { DetailCardAction, DetailCardBadge } from "@/features/mypage/types";
import ReviewModal, { ReviewFormValues } from "@/components/ui/Modals/ReviewModal";
import { MeetupItem } from "@/features/mypage/types";
import Alert from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import { useMyMeetupInfinite } from "@/features/mypage/queries";
import Empty from "@/components/layout/Empty";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import {
	useDeleteMeeting,
	useDeleteMeetingJoin,
	usePatchMeetingStatus,
	usePostMeetingsReviews,
} from "../mutations";
import { useUserStore } from "@/store/user.store";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";

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

// alert 메세지
const ALERT_MESSAGE = {
	confirm: "모임을 확정하시겠습니까?",
	delete: "모임을 삭제하시겠습니까?",
	cancelMeetup: "모임 취소하시겠습니까? \n 	취소한 모임은 모임 이용이 불가능 합니다.",
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
					variant: "grayBorder",
					handleCardButtonClick: handlers.onCancelMeetup,
				},
			];
		}
		return [
			{
				label: "모임 취소하기",
				variant: "grayBorder",
				handleCardButtonClick: handlers.onCancelMeetup,
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

function Meetup() {
	const userId = useUserStore((state) => state.user?.id);

	const { handleWishToggle } = useMeetingFavorite();
	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<MeetupItem | null>(null);
	// 어떤 모임에 대해 alert을 띄웠는지
	const [alertTarget, setAlertTarget] = useState<MeetupItem | null>(null);
	// alert이 어떤 행동을 할것인지
	const [alertAction, setAlertAction] = useState<AlertAction | null>(null);

	// 모임 목록 불러오기
	const {
		data: meetupData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMyMeetupInfinite();
	const items = meetupData.pages.flatMap((page) => page.data) ?? [];
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
	});

	// 모임 상태 변경하기
	const { mutate: patchMeetingStatus, isPending: isStatusPending } = usePatchMeetingStatus();

	// 모임 삭제하기
	const { mutate: deleteMeeting, isPending: isDeletePending } = useDeleteMeeting();

	// 모임 예약 취소하기
	const { mutate: deleteMeetingJoin, isPending: isJoinCancelPending } = useDeleteMeetingJoin();

	// 어떤 액션이든 하나라도 pending이면 true
	const isAlertPending = isStatusPending || isDeletePending || isJoinCancelPending;

	// 모임 리뷰 작성하기
	const { mutate: postMeetingReview, isPending: isMeetingReviewPending } = usePostMeetingsReviews();

	// alert modal 닫기
	function closeAlert() {
		setAlertTarget(null);
		setAlertAction(null);
	}

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
	}

	// DetailCard 버튼 핸들러 - 실제 api 행동이 아닌 alert을 우선 띄움
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

	// Alert 확인 시 api 연결
	function handleAlertConfirm() {
		if (!alertTarget || !alertAction) return;

		const actionHandlers: Record<AlertAction, () => void> = {
			// 모임 확정
			confirm: () =>
				patchMeetingStatus(
					{ meetingId: alertTarget.id, status: "CONFIRMED" },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 취소
			cancelMeetup: () =>
				patchMeetingStatus(
					{ meetingId: alertTarget.id, status: "CANCELED" },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 삭제
			delete: () =>
				deleteMeeting(
					{ meetingId: alertTarget.id },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 예약 취소
			cancelReservation: () =>
				deleteMeetingJoin(
					{ meetingId: alertTarget.id },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
		};

		actionHandlers[alertAction]();
	}

	// 리뷰 제출 시
	function handleReviewSubmit(reviewFormValues: ReviewFormValues) {
		if (!reviewTarget) return;
		postMeetingReview(
			{ meetingId: reviewTarget.id, reviewFormValues },
			{ onSuccess: closeReviewModal, onError: closeReviewModal },
		);
	}

	if (!userId) return null;

	if (items.length === 0) return <Empty>아직 참여한 모임이 없어요</Empty>;
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
								handleWishClick: () => handleWishToggle(item.id, item.isFavorited),
							}}
						/>
					);
				})}
			</ul>

			<div ref={observerRef} className="h-4" />
			{isFetchingNextPage && <Loading />}

			<Alert
				isOpen={!!alertTarget}
				isPending={isAlertPending}
				onClose={closeAlert}
				handleConfirmButton={handleAlertConfirm}>
				{alertAction ? ALERT_MESSAGE[alertAction] : ""}
			</Alert>

			<ReviewModal
				mode="create"
				isOpen={!!reviewTarget}
				onClose={closeReviewModal}
				handleFormSubmit={handleReviewSubmit}
				isPending={isMeetingReviewPending}
			/>
		</>
	);
}
export default function MeetupWrapper() {
	return (
		<Suspense fallback={<DetailCardSkeleton />}>
			<Meetup />
		</Suspense>
	);
}
