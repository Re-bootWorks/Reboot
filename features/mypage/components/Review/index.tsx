"use client";
import { useState } from "react";
import DetailCard from "../DetailCard";
import ReviewFormModal, { ReviewFormValues } from "../ReviewFormModal";
import { WritableReviewItem, WritableReviewList } from "@/features/mypage/type";
import { mockMyReviews, mockMyWritableReview, mockUserProfile } from "../../mockData";
import useMeetingFavorite from "../../hooks/useMeetingFavorite";
import TabButton from "@/components/ui/Buttons/TabButton";
import ReviewCard from "../ReviewCard";
import { ReviewCardItem, ReviewList } from "../ReviewCard/type";
import AlertModal from "@/components/ui/Modals/AlertModal";

type ReviewTabId = "writable" | "written";

// 작성 가능한 리뷰 탭
function Writable() {
	const initialItems: WritableReviewList = mockMyWritableReview;

	const [items, setItems] = useState(initialItems);
	const { handleWishToggle } = useMeetingFavorite(setItems);
	const [reviewTarget, setReviewTarget] = useState<WritableReviewItem | null>(null);

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
								handleWishClick: () => handleWishToggle(item.id),
							}}
						/>
					);
				})}
			</ul>

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
	const initialItems: ReviewList = mockMyReviews;

	const [items, setItems] = useState(initialItems);
	const [reviewTarget, setReviewTarget] = useState<ReviewCardItem | null>(null);
	const [alertTarget, setAlertTarget] = useState<ReviewCardItem | null>(null);

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

	return (
		<>
			<ul className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:rounded-4xl md:py-6 lg:gap-6 lg:p-8">
				{items.map((reviewItem) => (
					<ReviewCard
						key={reviewItem.id}
						user={mockUserProfile}
						item={reviewItem}
						handleEdit={() => setReviewTarget(reviewItem)}
						handleDelete={() => setAlertTarget(reviewItem)}
					/>
				))}
			</ul>
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
		writable: <Writable />,
		written: <Written />,
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
