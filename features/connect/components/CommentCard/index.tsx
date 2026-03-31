"use client";

import type { CommentCardProps } from "@/features/connect/comment/types";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { useState } from "react";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import Button from "@/components/ui/Buttons/Button";
import { useUpdateComment } from "@/features/connect/mutations";
import { useDeleteComment } from "@/features/connect/mutations";
import Alert from "@/components/ui/Modals/AlertModal";

interface CommentEditFormProps {
	value: string;
	onChange: (value: string) => void;
	onCancel: () => void;
	onSubmit: () => void;
}

function CommentEditForm({ value, onChange, onCancel, onSubmit }: CommentEditFormProps) {
	return (
		<div className="flex flex-col gap-2 border-b border-gray-200 py-2">
			<InputTextarea
				name="edit-comment"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="rounded-2xl bg-gray-100 px-3 py-2"
			/>
			<div className="flex justify-end gap-2">
				<Button
					onClick={onCancel}
					className="h-10 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700">
					취소
				</Button>
				<Button onClick={onSubmit}>수정</Button>
			</div>
		</div>
	);
}
export default function CommentCard({
	id,
	content,
	authorName,
	date,
	authorId,
	currentUserId,
	postId,
}: CommentCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(content);
	const isMine = authorId === currentUserId;
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const deleteMutation = useDeleteComment(postId);

	const mutation = useUpdateComment({
		postId,
		onSuccess: () => setIsEditing(false),
	});

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setEditValue(content); // 원래 값으로 복원
		setIsEditing(false);
	};

	const handleSubmit = () => {
		if (!editValue.trim()) return;
		mutation.mutate({ postId, commentId: id, content: editValue });
	};

	const handleDelete = () => setIsDeleteModalOpen(true);

	if (isEditing) {
		return (
			<CommentEditForm
				value={editValue}
				onChange={setEditValue}
				onCancel={handleCancel}
				onSubmit={handleSubmit}
			/>
		);
	}

	return (
		<>
			<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
				<div className="pt-[8px] pb-[24px] md:pt-[16px]">
					{/* 댓글 내용 */}
					<div className="flex items-start justify-between pb-[8px]">
						<div className="text-sm leading-[28px] font-normal tracking-[-0.36px] text-gray-700 md:text-lg">
							{content}
						</div>
						{isMine && (
							<ActionDropdown
								items={[
									{ label: "수정하기", onClick: handleEdit },
									{ label: "삭제하기", onClick: handleDelete, danger: true },
								]}
							/>
						)}
					</div>

					{/* 댓글 메타 영역 */}
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<span>{authorName}</span>
						<span>·</span>
						<RelativeTime date={date} fallback="date" />
					</div>
				</div>
			</div>

			<Alert
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				handleConfirmButton={() => {
					deleteMutation.mutate(id);
					setIsDeleteModalOpen(false);
				}}
				confirmLabel="삭제">
				댓글을 삭제하시겠습니까?
			</Alert>
		</>
	);
}
