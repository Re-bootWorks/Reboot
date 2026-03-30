"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import ReviewFormModal, { ReviewFormValues } from "@/components/ui/Modals/ReviewModal";
import { WritableReviewItem } from "@/features/mypage/types";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import TabButton from "@/components/ui/Buttons/TabButton";
import ReviewCard from "../components/ReviewCard";
import { ReviewCardItem } from "@/features/mypage/types";
import AlertModal from "@/components/ui/Modals/AlertModal";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";
import ReviewCardSkeleton from "../components/ReviewCard/ReviewCardSkeleton";
import { useMyMeetupInfinite, useMyReviewInfinite } from "../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/layout/Empty";
import { useUserStore } from "@/store/user.store";

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

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
	}

	// 리뷰 제출 시
	async function handleReviewSubmit(reviewFormValues: ReviewFormValues) {
		if (!reviewTarget) return;
		console.log("리뷰 작성 API", reviewTarget.id, reviewFormValues);

		closeReviewModal();
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

			<ReviewFormModal
				mode="create"
				isOpen={!!reviewTarget}
				onClose={closeReviewModal}
				handleFormSubmit={handleReviewSubmit}
			/>
		</>
	);
}

// 작성한 리뷰 탭
function Written() {
	const user = useUserStore((state) => state.user);

	// 어떤 모임에 대해 리뷰 모달을 열었는지 추적 후 target의 item만 값 변경 가능
	const [reviewTarget, setReviewTarget] = useState<ReviewCardItem | null>(null);
	// 어떤 모임에 대해 alert을 띄웠는지
	const [alertTarget, setAlertTarget] = useState<ReviewCardItem | null>(null);

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

	// alert modal 닫기
	function closeAlert() {
		setAlertTarget(null);
	}

	// review modal 닫기
	function closeReviewModal() {
		setReviewTarget(null);
	}

	// review 수정 시 기존 값 추출
	const reviewInitialValue = reviewTarget
		? {
				score: reviewTarget.score,
				comment: reviewTarget.comment,
			}
		: undefined;

	// 리뷰 수정 시 제출
	async function handleReviewSubmit(reviewFormValues: ReviewFormValues) {
		if (!reviewTarget) return;
		console.log("리뷰 수정 API", reviewTarget.id, reviewFormValues);

		closeReviewModal();
	}

	// 리뷰 삭제
	async function handleReviewDelete() {
		if (!alertTarget) return;
		console.log("리뷰 삭제 API", alertTarget.id);

		closeAlert();
	}

	if (!user) return null;
	if (items.length === 0) return <Empty>아직 작성한 리뷰가 없어요</Empty>;

	return (
		<>
			<ul className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:rounded-4xl md:py-6 lg:gap-6 lg:p-8">
				{items.map((reviewItem) => (
					<ReviewCard
						key={reviewItem.id}
						user={user}
						item={reviewItem}
						handleEdit={() => setReviewTarget(reviewItem)}
						handleDelete={() => setAlertTarget(reviewItem)}
					/>
				))}
			</ul>

			<div ref={observerRef} className="h-4" />
			{isFetchingNextPage && <Loading />}

			<AlertModal
				isOpen={!!alertTarget}
				onClose={closeAlert}
				handleConfirmButton={handleReviewDelete}>
				리뷰를 삭제하시겠습니까?
			</AlertModal>

			<ReviewFormModal
				mode="edit"
				initialValue={reviewInitialValue}
				isOpen={!!reviewTarget}
				onClose={closeReviewModal}
				handleFormSubmit={handleReviewSubmit}
			/>
		</>
	);
}

// 나의 리뷰 탭 Wrapper
export default function Review() {
	const [activeTab, setActiveTab] = useState<ReviewTabId>("writable");

	const tabContents: Record<ReviewTabId, React.ReactNode> = {
		writable: (
			<Suspense fallback={<DetailCardSkeleton showBadge={false} />}>
				<Writable />
			</Suspense>
		),
		written: (
			<Suspense fallback={<ReviewCardSkeleton />}>
				<Written />
			</Suspense>
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
