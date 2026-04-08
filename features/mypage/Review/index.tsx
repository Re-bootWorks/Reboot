"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import ReviewModal, { ReviewFormValues } from "@/components/ui/Modals/ReviewModal";
import { WritableReviewItem } from "@/features/mypage/types";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import TabButton from "@/components/ui/Buttons/TabButton";
import ReviewCard from "../components/ReviewCard";
import { ReviewCardItem } from "@/features/mypage/types";
import Alert from "@/components/ui/Modals/AlertModal";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";
import ReviewCardSkeleton from "../components/ReviewCard/ReviewCardSkeleton";
import { useMyMeetupInfinite, useMyReviewInfinite } from "../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/layout/Empty";
import { useUserStore } from "@/store/user.store";
import { useDeleteReviews, usePatchReviews, usePostMeetingsReviews } from "../mutations";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";

type ReviewTabId = "writable" | "written";

// 작성 가능한 리뷰 탭
function Writable() {
	const { handleWishToggle } = useMeetingFavorite();
	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<WritableReviewItem | null>(null);

	const {
		data: meetupData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMyMeetupInfinite({ completed: true, reviewed: false });
	const items = meetupData.pages.flatMap((page) => page.data) ?? [];
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
	});

	// 모임 리뷰 작성하기
	const { mutate: postMeetingReview, isPending: isMeetingReviewPending } = usePostMeetingsReviews();

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
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
					return (
						<DetailCard
							key={item.id}
							item={item}
							actions={[
								{
									label: "리뷰 작성하기",
									variant: "purple",
									handleCardButtonClick: () => setReviewTarget(item),
								},
							]}
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

// 작성한 리뷰 탭
function Written() {
	const user = useUserStore((state) => state.user);

	// 어떤 모임에 대해 alert을 띄웠는지
	const [alertTarget, setAlertTarget] = useState<ReviewCardItem | null>(null);
	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<ReviewCardItem | null>(null);
	// reviewTarget과 별도로 관리 → 모달 닫혀도 값 유지
	const [reviewInitialValue, setReviewInitialValue] = useState<
		Partial<ReviewFormValues> | undefined
	>();

	const {
		data: reviewData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMyReviewInfinite();
	const items = reviewData.pages.flatMap((page) => page.data) ?? [];
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
	});

	// 리뷰 수정하기
	const { mutate: patchReviews, isPending: isPatchReviewsPending } = usePatchReviews();

	// 리뷰 삭제하기
	const { mutate: deleteReviews, isPending: isDeleteReviewsPending } = useDeleteReviews();

	// alert modal 닫기
	function closeAlert() {
		setAlertTarget(null);
	}

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
	}

	// 수정 버튼 클릭 시 initialValue 따로 저장
	function handleReviewEdit(reviewItem: ReviewCardItem) {
		setReviewInitialValue({
			score: reviewItem.score,
			comment: reviewItem.comment,
		});
		setReviewTarget(reviewItem);
	}

	// 리뷰 수정 시 제출
	function handleReviewSubmit(reviewFormValues: ReviewFormValues) {
		if (!reviewTarget) return;
		patchReviews(
			{ reviewId: reviewTarget.id, reviewFormValues },
			{ onSuccess: closeReviewModal, onError: closeReviewModal },
		);
	}

	// 리뷰 삭제
	async function handleReviewDelete() {
		if (!alertTarget) return;
		deleteReviews({ reviewId: alertTarget.id }, { onSuccess: closeAlert, onError: closeAlert });
	}

	if (!user) return null;
	if (items.length === 0) return <Empty>아직 작성한 리뷰가 없어요</Empty>;

	return (
		<>
			<ul className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:gap-0 md:rounded-4xl md:py-6 lg:p-8">
				{items.map((reviewItem) => (
					<ReviewCard
						key={reviewItem.id}
						user={user}
						item={reviewItem}
						handleEdit={() => handleReviewEdit(reviewItem)}
						handleDelete={() => setAlertTarget(reviewItem)}
					/>
				))}
			</ul>

			<div ref={observerRef} className="h-4" />
			{isFetchingNextPage && <Loading />}

			<Alert
				isOpen={!!alertTarget}
				isPending={isDeleteReviewsPending}
				onClose={closeAlert}
				handleConfirmButton={handleReviewDelete}>
				리뷰를 삭제하시겠습니까?
			</Alert>

			<ReviewModal
				mode="edit"
				initialValue={reviewInitialValue}
				isOpen={!!reviewTarget}
				isPending={isPatchReviewsPending}
				onClose={closeReviewModal}
				handleFormSubmit={handleReviewSubmit}
			/>
		</>
	);
}

// 나의 리뷰 탭 Wrapper
export default function ReviewWrapper() {
	const [activeTab, setActiveTab] = useState<ReviewTabId>("writable");

	const tabContents: Record<ReviewTabId, React.ReactNode> = {
		writable: (
			<QueryErrorBoundary prefix="작성 가능 한 리뷰를 ">
				<Suspense fallback={<DetailCardSkeleton showBadge={false} />}>
					<Writable />
				</Suspense>
			</QueryErrorBoundary>
		),
		written: (
			<QueryErrorBoundary prefix="작성한 리뷰를 ">
				<Suspense fallback={<ReviewCardSkeleton />}>
					<Written />
				</Suspense>
			</QueryErrorBoundary>
		),
	};
	return (
		<>
			<div className="my-4 flex items-center gap-2.5 md:my-8">
				<TabButton
					selected={activeTab === "writable"}
					onClick={() => {
						setActiveTab("writable");
					}}>
					작성 가능한 리뷰
				</TabButton>
				<TabButton
					selected={activeTab === "written"}
					onClick={() => {
						setActiveTab("written");
					}}>
					작성한 리뷰
				</TabButton>
			</div>
			{tabContents[activeTab]}
		</>
	);
}
