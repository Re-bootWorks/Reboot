"use client";

import { Suspense, useRef, useState } from "react";
import ReviewCard from "./ReviewCard";
import Empty from "@/components/layout/Empty";
import { ReviewCardProps, ReviewsListRequest } from "../../types";
import { toDateTimeRangeEnd, toDateTimeRangeStart } from "../../utils";
import { useReviewsInfiniteQuery } from "../../queries/infiniteQuery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import { useSearchParams } from "next/navigation";
import ReviewsSectionSkeleton from "./reviewsSkeleton";
import Alert from "@/components/ui/Modals/AlertModal";
import ReviewModal, { ReviewFormValues } from "@/components/ui/Modals/ReviewModal";
import { useDeleteReviews, usePatchReviews } from "../../mutations";

export default function ReviewsCard() {
	return (
		<section className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
			<Suspense fallback={<ReviewsSectionSkeleton />}>
				<ReviewsCardContent />
			</Suspense>
		</section>
	);
}

function ReviewsCardContent() {
	const searchParams = useSearchParams();

	const params: ReviewsListRequest = {
		type: searchParams.get("type") ?? undefined,
		region: searchParams.get("region") ?? undefined,
		dateStart: toDateTimeRangeStart(searchParams.get("dateStart")),
		dateEnd: toDateTimeRangeEnd(searchParams.get("dateEnd")),
		sortBy: (searchParams.get("sortBy") as ReviewsListRequest["sortBy"]) ?? undefined,
		sortOrder: (searchParams.get("sortOrder") as ReviewsListRequest["sortOrder"]) ?? undefined,
		size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
	};

	const {
		data: reviews,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useReviewsInfiniteQuery(params);

	const bottomRef = useRef<HTMLDivElement>(null);

	useIntersectionObserver({
		targetRef: bottomRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	const hasReviews = reviews.length > 0;

	// 어떤 모임에 대해 alert을 띄웠는지
	const [alertTarget, setAlertTarget] = useState<ReviewCardProps | null>(null);
	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<ReviewCardProps | null>(null);
	// reviewTarget과 별도로 관리 → 모달 닫혀도 값 유지
	const [reviewInitialValue, setReviewInitialValue] = useState<
		Partial<ReviewFormValues> | undefined
	>();

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
	function handleReviewEdit(reviewItem: ReviewCardProps) {
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

	return (
		<>
			{hasReviews ? (
				<div className="flex flex-col gap-4 md:gap-8">
					{reviews.map((review) => (
						<ReviewCard
							key={review.id}
							handleEdit={() => handleReviewEdit(review)}
							handleDelete={() => setAlertTarget(review)}
							{...review}
						/>
					))}
				</div>
			) : (
				<Empty>아직 리뷰가 없어요</Empty>
			)}
			<div ref={bottomRef} />

			{isFetchingNextPage && <Loading className="flex h-30 items-center justify-center" />}

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
