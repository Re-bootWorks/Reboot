"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { ReviewScore } from "@/types/common";
import { Rating, Heart } from "@smastrom/react-rating";
import { formatIsoDateWithDots } from "@/utils/date";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { User } from "@/features/meetupDetail/types";
import Empty from "@/components/ui/Empty";
import { useUserStore } from "@/store/user.store";
import ReviewModal, { ReviewFormValues } from "@/features/shared/components/ReviewModal";
import { useDeleteReviewMutation, useEditReviewMutation } from "@/features/meetupDetail/mutations";
import Alert from "@/components/ui/Modals/AlertModal";
import Avatar from "@/components/ui/Avatar";

export interface CommentProps {
	id: number;
	score: ReviewScore;
	comment: string;
	createdAt: string;
	user: User;
}

interface CommentItemProps extends CommentProps {
	onEdit: () => void;
	onDelete: () => void;
}

const heartStyles = {
	itemShapes: Heart,
	activeFillColor: "#7566E5",
	inactiveFillColor: "#DDD",
};

function CommentItem({ score, comment, createdAt, user, onEdit, onDelete }: CommentItemProps) {
	const { user: me, isPending } = useUserStore();
	const myReview = !isPending && me?.id === user.id;

	return (
		<div className="h-fit w-full border-b border-gray-200 pt-2 pb-6 last:border-none md:pt-4">
			<div className="flex h-fit w-full flex-col gap-3">
				<div className="flex h-fit w-full flex-col gap-3">
					<Rating
						value={score}
						readOnly
						itemStyles={heartStyles}
						className="max-w-25 md:max-w-30"
					/>
					<div className="flex h-fit w-full justify-between gap-2">
						<div className="flex h-fit w-fit items-center gap-1.5">
							<Avatar
								src={user.image}
								alt={user.name}
								width={24}
								height={24}
								className="shrink-0"
							/>
							<div className="flex h-fit w-fit items-center gap-1 text-xs font-normal text-gray-500 md:gap-1.5 md:text-sm">
								<span>{user.name}</span>
								<time dateTime={createdAt}>{formatIsoDateWithDots(createdAt)}</time>
							</div>
						</div>
						{myReview && (
							<ActionDropdown
								items={[
									{ label: "수정하기", onClick: onEdit },
									{ label: "삭제하기", onClick: onDelete },
								]}
							/>
						)}
					</div>
				</div>
				<div className="flex h-fit w-full justify-between text-gray-700 md:gap-2">
					<p className="h-fit w-full text-sm font-normal whitespace-pre-line md:text-lg">
						{comment}
					</p>
				</div>
			</div>
		</div>
	);
}

interface CommentCardsProps {
	meetingId: number;
	comments: CommentProps[];
	currentPage: number;
	hasMore: boolean;
	onPageChange: (page: number) => void;
}

export default function CommentCards({
	meetingId,
	comments,
	currentPage,
	hasMore,
	onPageChange,
}: CommentCardsProps) {
	const hasComments = comments.length > 0;

	const [editTarget, setEditTarget] = useState<CommentProps | null>(null);
	const [editInitialValue, setEditInitialValue] = useState<Partial<ReviewFormValues>>();
	const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

	const { mutate: editReview, isPending: isEditPending } = useEditReviewMutation(meetingId);
	const { mutate: deleteReview, isPending: isDeletePending } = useDeleteReviewMutation(meetingId);

	const handleEditOpen = (comment: CommentProps) => {
		setEditInitialValue({ score: comment.score, comment: comment.comment });
		setEditTarget(comment);
	};

	const handleReviewSubmit = (reviewFormValues: ReviewFormValues) => {
		if (!editTarget) return;
		editReview(
			{
				reviewId: editTarget.id,
				data: { score: reviewFormValues.score as ReviewScore, comment: reviewFormValues.comment },
			},
			{ onSuccess: () => setEditTarget(null) },
		);
	};

	const handleReviewDelete = () => {
		if (!deleteTargetId) return;
		deleteReview(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) });
	};

	return (
		<div className="flex h-fit w-full flex-col gap-3 md:gap-4 lg:gap-5">
			<div className="flex h-fit w-full gap-2.5 pl-1.5 lg:pl-2.5">
				<h3 className="text-base font-semibold md:text-xl lg:text-2xl">리뷰 모아보기</h3>
			</div>

			<div className="flex h-fit w-full flex-col items-center gap-8 md:gap-10">
				<div className="flex h-fit w-full flex-col items-center gap-2.5 overflow-hidden rounded-3xl bg-white px-5 pt-4 pb-2 md:rounded-4xl md:px-12 md:py-6">
					{hasComments ? (
						<div className="flex h-fit w-full flex-col">
							{comments.map((comment) => (
								<CommentItem
									key={comment.id}
									{...comment}
									onEdit={() => handleEditOpen(comment)}
									onDelete={() => setDeleteTargetId(comment.id)}
								/>
							))}
						</div>
					) : (
						<Empty section className="w-full">
							아직 작성된 리뷰가 없어요.
						</Empty>
					)}
				</div>
				{(hasMore || currentPage > 1) && (
					<Pagination
						currentPage={currentPage}
						totalPages={hasMore ? currentPage + 1 : currentPage}
						handlePageChange={onPageChange}
					/>
				)}
			</div>

			{/* 수정 모달 */}
			<ReviewModal
				mode="edit"
				initialValue={editInitialValue}
				isOpen={!!editTarget}
				isPending={isEditPending}
				onClose={() => setEditTarget(null)}
				handleFormSubmit={handleReviewSubmit}
			/>

			{/* 삭제 확인 모달 */}
			<Alert
				isOpen={!!deleteTargetId}
				isPending={isDeletePending}
				onClose={() => setDeleteTargetId(null)}
				confirmLabel="삭제하기"
				handleConfirmButton={handleReviewDelete}>
				<p>리뷰를 정말 삭제하시겠어요?</p>
				<p className="mt-1 text-sm font-normal text-gray-500">삭제 후에는 되돌릴 수 없습니다.</p>
			</Alert>
		</div>
	);
}
