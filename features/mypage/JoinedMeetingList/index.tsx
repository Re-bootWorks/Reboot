"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import { MeetupDetailItem } from "@/features/mypage/types";
import ReviewModal, { ReviewFormValues } from "@/features/shared/components/ReviewModal";
import Alert from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import { useMyJoinedInfinite } from "@/features/mypage/queries";
import Empty from "@/components/ui/Empty";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import {
	useDeleteMeetings,
	useDeleteMeetingsJoin,
	usePatchMeetingsStatus,
	usePostMeetingsReviews,
} from "../mutations";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import {
	ALERT_MESSAGE,
	AlertActionType,
	MeetupActionHandlers,
	meetupActions,
	meetupBadges,
} from "../utils";

interface JoinedMeetingListProps {
	onDropdownOpenChange?: (open: boolean) => void;
}

function JoinedMeetingList({ onDropdownOpenChange }: JoinedMeetingListProps) {
	const { handleWishToggle } = useMeetingFavorite();
	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<MeetupDetailItem | null>(null);
	// 어떤 모임에 대해 alert을 띄웠는지
	const [alertTarget, setAlertTarget] = useState<MeetupDetailItem | null>(null);
	// alert이 어떤 행동을 할것인지
	const [alertAction, setAlertAction] = useState<AlertActionType | null>(null);

	// 모임 목록 불러오기
	const {
		data: meetupData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMyJoinedInfinite();
	const items = meetupData.pages.flatMap((page) => page.data) ?? [];

	// 모임 목록 무한스크롤
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
	});

	// 모임 상태 변경하기
	const { mutate: patchMeetingsStatus, isPending: isStatusPending } = usePatchMeetingsStatus();

	// 모임 삭제하기
	const { mutate: deleteMeetings, isPending: isDeletePending } = useDeleteMeetings();

	// 모임 참여 취소하기
	const { mutate: deleteMeetingsJoin, isPending: isJoinCancelPending } = useDeleteMeetingsJoin();

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
	function meetupActionHandlers(item: MeetupDetailItem): MeetupActionHandlers {
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
			// 참여 취소하기
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

		const actionHandlers: Record<AlertActionType, () => void> = {
			// 모임 확정
			confirm: () =>
				patchMeetingsStatus(
					{ meetingId: alertTarget.id, status: "CONFIRMED" },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 취소
			cancelMeetup: () =>
				patchMeetingsStatus(
					{ meetingId: alertTarget.id, status: "CANCELED" },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 삭제
			delete: () =>
				deleteMeetings(
					{ meetingId: alertTarget.id },
					{ onSuccess: closeAlert, onError: closeAlert },
				),
			// 모임 참여 취소
			cancelReservation: () =>
				deleteMeetingsJoin(
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

	if (items.length === 0) return <Empty>아직 참여한 모임이 없어요</Empty>;
	return (
		<>
			<ul className="flex flex-col gap-4 lg:gap-6">
				{items.map((item) => {
					const handlers = meetupActionHandlers(item);
					return (
						<DetailCard
							key={item.id}
							item={item}
							badges={meetupBadges(item)}
							actionDisplay={item.role === "host" ? "dropdown" : "buttons"}
							onDropdownOpenChange={item.role === "host" ? onDropdownOpenChange : undefined}
							actions={meetupActions(item, handlers)}
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
				<span className="text-purple-600">
					{alertTarget?.name} <br />
				</span>
				{alertAction && ALERT_MESSAGE[alertAction]}
				{alertAction === "cancelMeetup" && <p>취소한 모임은 모임 이용이 불가능 합니다.</p>}
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
export default function JoinedMeetingListWrapper({ onDropdownOpenChange }: JoinedMeetingListProps) {
	return (
		<QueryErrorBoundary prefix="나의 모임을 ">
			<Suspense fallback={<DetailCardSkeleton />}>
				<JoinedMeetingList onDropdownOpenChange={onDropdownOpenChange} />
			</Suspense>
		</QueryErrorBoundary>
	);
}
