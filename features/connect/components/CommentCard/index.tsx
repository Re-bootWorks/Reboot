"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/apis/images";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import IcPerson from "@/components/ui/icons/IcPerson";
import Alert from "@/components/ui/Modals/AlertModal";
import UserProfileModal from "@/components/ui/Modals/UserProfileModal";
import { useDeleteComment, useUpdateComment } from "@/features/connect/mutations";
import { useGetUserProfile } from "@/features/connect/queries";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import type { CommentCardProps } from "@/features/connect/comment/types";
import { parseCommentContent, buildCommentContent } from "./parseCommentContent";
import CommentEditForm from "./CommentEditForm";

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
	// 상태
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(() => {
		const parsed = parseCommentContent(content);
		return parsed
			.filter((p) => p.type === "text")
			.map((p) => p.text)
			.join("\n");
	});
	const [editImageUrl, setEditImageUrl] = useState<string | null>(() => {
		const parsed = parseCommentContent(content);
		return parsed.find((p) => p.type === "image")?.url ?? null;
	});
	const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(editImageUrl);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

	// 파생 변수
	const isMine = authorId === currentUserId;
	const parsed = parseCommentContent(content);
	const initialText = parsed
		.filter((p) => p.type === "text")
		.map((p) => p.text)
		.join("\n");
	const initialImage = parsed.find((p) => p.type === "image")?.url ?? null;

	// 쿼리 / 뮤테이션
	const { data: profileData } = useGetUserProfile(
		isProfileModalOpen ? authorId : null, // 모달 열릴 때만 fetch
	);
	const deleteMutation = useDeleteComment(postId);
	const mutation = useUpdateComment({
		postId,
		onSuccess: () => setIsEditing(false),
	});

	// 핸들러
	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setEditValue(initialText);
		setEditImageUrl(initialImage);
		setEditPreviewUrl(initialImage);
		setIsEditing(false);
	};

	const handleSubmit = () => {
		if (!editValue.trim() && !editImageUrl) return;
		const content = buildCommentContent(editValue.trim(), editImageUrl ?? undefined);
		mutation.mutate({ postId, commentId: id, content });
	};

	const handleDelete = () => setIsDeleteModalOpen(true);

	const handleImageChange = async (file: File) => {
		setEditPreviewUrl(URL.createObjectURL(file));
		const url = await uploadImage(file);
		setEditImageUrl(url);
	};

	const handleImageRemove = () => {
		setEditPreviewUrl(null);
		setEditImageUrl(null);
	};

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
				previewUrl={editPreviewUrl}
				onImageChange={handleImageChange}
				onImageRemove={handleImageRemove}
			/>
		);
	}

	return (
		<>
			<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
				<div className="pt-[8px] pb-[24px] md:pt-[16px]">
					{/* 댓글 내용 */}
					<div className="flex items-start justify-between pb-[8px]">
						<div className="text-sm leading-[28px] font-normal tracking-[-0.36px] break-words text-gray-700 md:text-lg">
							{parseCommentContent(content).map((part, i) =>
								part.type === "image" ? (
									<div key={i} className="relative mt-2 h-48 w-48">
										<Image
											src={part.url}
											alt="첨부 이미지"
											fill
											className="rounded-lg object-cover"
										/>
									</div>
								) : (
									<p key={i}>{part.text}</p>
								),
							)}
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
						role="button"
						className="text-md flex cursor-pointer items-center gap-2 text-gray-500"
						onClick={() => setIsProfileModalOpen(true)}>
						{authorImage ? (
							<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
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
