"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import ReviewModal, { ReviewFormValues } from "@/features/shared/components/ReviewModal";
import { WritableReviewItem } from "@/features/mypage/types";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import { useMyMeetupInfinite } from "../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { usePostMeetingsReviews } from "../mutations";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";

function AvailableReviewList() {
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

export default function AvailableReviewListWrapper() {
	return (
		<QueryErrorBoundary prefix="작성 가능 한 리뷰를 ">
			<Suspense fallback={<DetailCardSkeleton showBadge={false} />}>
				<AvailableReviewList />
			</Suspense>
		</QueryErrorBoundary>
	);
}
