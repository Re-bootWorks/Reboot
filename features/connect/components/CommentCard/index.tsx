"use client";

import { useState } from "react";
import { uploadImage } from "@/apis/images";
import Image from "next/image";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import Alert from "@/components/ui/Modals/AlertModal";
import UserProfileModal from "@/components/ui/Modals/UserProfileModal";
import { useDeleteComment, useUpdateComment } from "@/features/connect/mutations";
import { useGetUserProfile } from "@/features/connect/queries";
import RelativeTime from "@/components/ui/RelativeTime";
import type { CommentCardProps } from "@/features/connect/comment/types";
import { parseCommentContent, buildCommentContent } from "./parseCommentContent";
import CommentEditForm from "./CommentEditForm";
import { AnimatePresence, motion } from "motion/react";
import { commentEditVariants } from "@/features/connect/animations";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/providers/toast-provider";
import { useUser } from "@/hooks/useUser";
import { useToggleCommentLike } from "@/features/connect/mutations";
import IcHeart from "@/components/ui/icons/IcHeart";
import IcHeartOutline from "@/components/ui/icons/IcHeartOutline";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 1024 * 1024; // 1MB

export default function CommentCard({
	id,
	content,
	authorName,
	authorImage,
	date,
	authorId,
	currentUserId,
	postId,
	likeCount,
	isLiked,
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
	const { handleShowToast } = useToast();
	const { user } = useUser();

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
	const likeMutation = useToggleCommentLike(postId, id);

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
		// 타입 검사
		if (!ALLOWED_TYPES.includes(file.type)) {
			handleShowToast({
				message: "JPEG, PNG, WebP, GIF 형식만 업로드 가능합니다.",
				status: "error",
			});
			return;
		}

		// 크기 검사
		if (file.size > MAX_SIZE) {
			handleShowToast({
				message: "파일 크기는 1MB를 초과할 수 없습니다.",
				status: "error",
			});
			return;
		}

		setEditPreviewUrl(URL.createObjectURL(file));

		try {
			const url = await uploadImage(file);
			setEditImageUrl(url);
		} catch {
			handleShowToast({ message: "이미지 업로드에 실패했습니다.", status: "error" });
			setEditPreviewUrl(null);
		}
	};

	const handleImageRemove = () => {
		setEditPreviewUrl(null);
		setEditImageUrl(null);
	};

	const handleLike = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!user) {
			handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
			return;
		}
		likeMutation.mutate(isLiked);
	};

	return (
		<AnimatePresence mode="wait">
			{isEditing ? (
				<motion.div
					key="edit"
					variants={commentEditVariants.edit}
					initial="hidden"
					animate="visible"
					exit="exit">
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
				</motion.div>
			) : (
				<motion.div
					key="view"
					variants={commentEditVariants.view}
					initial="hidden"
					animate="visible"
					exit="exit">
					<>
						<div className="flex min-h-[96px] w-full gap-3 border-b border-gray-200 py-4">
							{/* 프로필 이미지 */}
							<div
								role="button"
								tabIndex={0}
								className="shrink-0 cursor-pointer"
								onClick={() => setIsProfileModalOpen(true)}
								onKeyDown={(e) => e.key === "Enter" && setIsProfileModalOpen(true)}>
								<Avatar
									src={authorImage ?? null}
									alt={authorName}
									width={40}
									height={40}
									className="md:!h-14 md:!w-14"
								/>
							</div>

							{/* 오른쪽 콘텐츠 */}
							<div className="flex flex-1 flex-col gap-1">
								{/* 유저이름 + 날짜 + 드롭다운 */}
								<div className="flex items-center justify-between">
									<div
										role="button"
										className="md:text-md flex cursor-pointer items-center gap-2 text-sm text-gray-500"
										onClick={() => setIsProfileModalOpen(true)}>
										<span className="text-md font-semibold text-gray-800">{authorName}</span>
										<RelativeTime date={date} fallback="date" />
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
								{/* 댓글 내용 + 드롭다운 + 좋아요 */}
								<div className="flex items-start justify-between">
									<div className="text-sm leading-[28px] font-normal tracking-[-0.36px] break-all text-gray-700 md:text-lg">
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
									<div className="ml-2 shrink-0">
										<button
											type="button"
											onClick={handleLike}
											disabled={likeMutation.isPending}
											aria-label={isLiked ? "좋아요 취소" : "좋아요"}
											className="flex flex-col items-center gap-0.5 text-sm transition-colors disabled:opacity-50">
											{isLiked ? (
												<IcHeart isGradient color="purple-400" size="sm" />
											) : (
												<IcHeartOutline color="gray-400" size="sm" />
											)}
											<span className={isLiked ? "text-purple-400" : "text-gray-400"}>
												{likeCount}
											</span>
										</button>
									</div>
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
				</motion.div>
			)}
		</AnimatePresence>
	);
}
