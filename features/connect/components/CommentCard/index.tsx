"use client";

import Image from "next/image";
import IcPerson from "@/components/ui/icons/IcPerson";
import type { CommentCardProps } from "@/features/connect/comment/types";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { useState } from "react";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import Button from "@/components/ui/Buttons/Button";
import { useUpdateComment } from "@/features/connect/mutations";
import { useDeleteComment } from "@/features/connect/mutations";
import Alert from "@/components/ui/Modals/AlertModal";
import UserProfileModal from "@/components/ui/Modals/UserProfileModal";
import { useGetUserProfile } from "@/features/connect/queries";

interface CommentEditFormProps {
	value: string;
	onChange: (value: string) => void;
	onCancel: () => void;
	onSubmit: () => void;
	authorName: string;
	authorImage?: string;
	date: number;
}

function CommentEditForm({
	value,
	onChange,
	onCancel,
	onSubmit,
	authorName,
	authorImage,
	date,
}: CommentEditFormProps) {
	return (
		<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
			<div className="pt-2 pb-6 md:pt-4">
				{/* textarea */}
				<InputTextarea
					name="edit-comment"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full bg-gray-50 px-3 py-2 text-sm text-gray-700 md:text-lg"
				/>

				{/* 메타 + 버튼 영역 */}
				<div className="flex items-center justify-between pt-2">
					{/* 작성자 + 날짜 */}
					<div className="flex items-center gap-2 text-xs text-gray-500">
						{authorImage ? (
							<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
								<Image src={authorImage} alt={authorName} fill className="object-cover" />
							</div>
						) : (
							<IcPerson color="gray-400" />
						)}
						<span>{authorName}</span>
						<span>·</span>
						<RelativeTime date={date} fallback="date" />
					</div>

					{/* 버튼 */}
					<div className="flex gap-2">
						<Button
							onClick={onCancel}
							className="h-10 w-[4.5rem] rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700">
							취소
						</Button>
						<Button onClick={onSubmit} className="h-10 w-[4.5rem] rounded-xl px-4 text-sm">
							수정
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default function CommentCard({
	id,
	content,
	authorName,
	authorImage,
	date,
	authorId,
	currentUserId,
	postId,
	isPending = false,
}: CommentCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(content);
	const isMine = authorId === currentUserId;
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const deleteMutation = useDeleteComment(postId);
	const { data: profileData } = useGetUserProfile(
		isProfileModalOpen ? authorId : null, // 모달 열릴 때만 fetch
	);

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
				authorName={authorName}
				authorImage={authorImage}
				date={date}
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
						{isMine && !isPending && (
							<ActionDropdown
								items={[
									{ label: "수정하기", onClick: handleEdit },
									{ label: "삭제하기", onClick: handleDelete, danger: true },
								]}
							/>
						)}
					</div>

					{/* 댓글 메타 영역 */}
					<div
						className="flex cursor-pointer items-center gap-2 text-xs text-gray-500"
						onClick={() => setIsProfileModalOpen(true)}>
						{authorImage ? (
							<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
								<Image src={authorImage} alt={authorName} fill className="object-cover" />
							</div>
						) : (
							<IcPerson color="gray-400" />
						)}
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

			<UserProfileModal
				isOpen={isProfileModalOpen}
				onClose={() => setIsProfileModalOpen(false)}
				authorName={authorName}
				authorImage={authorImage}
				email={profileData?.email || ""}
			/>
		</>
	);
}
