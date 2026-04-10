"use client";
import { Suspense, useRef, useState } from "react";
import ReviewModal, { ReviewFormValues } from "@/features/shared/components/ReviewModal";
import ReviewCard from "../components/ReviewCard";
import { ReviewCardItem } from "@/features/mypage/types";
import Alert from "@/components/ui/Modals/AlertModal";
import ReviewCardSkeleton from "../components/ReviewCard/ReviewCardSkeleton";
import { useMyReviewInfinite } from "../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { useDeleteReviews, usePatchReviews } from "../mutations";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import { useUser } from "@/hooks/useUser";

function WrittenReviewList() {
	const { user } = useUser();

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
				<span className="text-purple-600">
					{alertTarget?.meetingName} <br />
				</span>
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
export default function WrittenReviewListWrapper() {
	return (
		<QueryErrorBoundary prefix="작성한 리뷰를 ">
			<Suspense fallback={<ReviewCardSkeleton />}>
				<WrittenReviewList />
			</Suspense>
		</QueryErrorBoundary>
	);
}
