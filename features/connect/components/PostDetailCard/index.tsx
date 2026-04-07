"use client";

import Image from "next/image";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import IcCalendarOutline from "@/components/ui/icons/IcCalendarOutline";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import dayjs from "@/libs/dayjs";
import { useRouter } from "next/navigation";
import { useDeletePost, useToggleConnectLike } from "@/features/connect/mutations";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";
import Alert from "@/components/ui/Modals/AlertModal";
import { useState } from "react";

interface Props {
	id: number;
	title: string;
	authorImage?: string;
	content: string;
	imageUrl: string;
	author: string;
	createdAt: string;
	likeCount: number;
	commentCount: number;
	date: number;
	isAuthor: boolean;
	isLiked: boolean;
}

export default function PostDetailCard({
	id,
	title,
	authorImage,
	content,
	imageUrl,
	author,
	createdAt,
	likeCount,
	commentCount,
	date,
	isAuthor,
	isLiked,
}: Props) {
	const router = useRouter();
	const { user } = useUserStore();
	const { handleShowToast } = useToast();
	const { mutate: deletePost } = useDeletePost(id);
	const { mutate: toggleLike } = useToggleConnectLike(id);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	return (
		<>
			<div className="w-full rounded-[48px] bg-white px-6 pt-6 pb-5 md:px-10 md:pt-10 md:pb-9 lg:px-16 lg:pt-12 lg:pb-14">
				{/* 제목 */}
				<div className="flex items-start justify-between">
					<h1 className="text-[20px] leading-[30px] font-bold tracking-[-0.4px] md:text-3xl md:leading-[2.25rem]">
						{title}
					</h1>
					{isAuthor && (
						<ActionDropdown
							items={[
								{
									label: "수정하기",
									onClick: () => router.push(`/connect/edit/${id}`),
								},
								{
									label: "삭제하기",
									onClick: () => setIsDeleteModalOpen(true),
									danger: true,
								},
							]}
						/>
					)}
				</div>
				{/* 작성자 */}
				<div className="mt-3 flex items-center justify-between border-b border-gray-200 pb-3 text-sm md:mt-5">
					{/* 프로필 / 이름 / 날짜 */}
					<div className="flex items-center gap-2">
						<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
							<Image
								src={authorImage || "/assets/img/img_profile.svg"}
								alt="profile"
								fill
								className="object-cover"
							/>
						</div>
						<span>
							{author} · {dayjs(createdAt).format("YYYY.MM.DD")}
						</span>
					</div>

					{/* 캘린더 아이콘 / 상대시간 */}
					<div className="flex items-center gap-0.5 text-gray-500">
						<IcCalendarOutline color="gray-800" size="sm" />
						<RelativeTime
							date={new Date(createdAt).getTime()}
							fallback="date"
							className="text-gray-800"
						/>
					</div>
				</div>
				{/* 내용 */}
				<div
					className="mt-6 min-h-[140px] max-w-none overflow-hidden text-base leading-6 tracking-[-0.32px] text-gray-700 md:mt-10 [&_em]:italic [&_img]:my-4 [&_img]:rounded-[24px] [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
				{/* 이미지 */}
				{imageUrl && (
					<div className="mt-8">
						<div className="relative h-[200px] w-[200px] overflow-hidden">
							<Image src={imageUrl} alt="post image" fill className="object-cover" />
						</div>
					</div>
				)}
				{/* 하단 정보 */}
				<div className="mt-10 flex items-center gap-2 text-sm tracking-[-0.28px] text-gray-500 md:mt-12">
					<div className="flex items-center gap-3">
						{/* 좋아요 */}
						<button
							onClick={() => {
								if (!user) {
									handleShowToast({ message: "로그인이 필요합니다.", status: "error" });
									return;
								}
								toggleLike(isLiked);
							}}
							className="flex items-center gap-0.5 text-gray-500">
							<IcThumbOutline color={isLiked ? "purple-500" : "gray-400"} size={20} />
							<span className={`text-base ${isLiked ? "text-purple-500" : ""}`}>{likeCount}</span>
						</button>

						{/* 댓글 */}
						<div className="flex items-center gap-0.5 text-gray-500">
							<IcMessageOutline color="gray-400" size={20} />
							<span className="text-base">{commentCount}</span>
						</div>
					</div>
				</div>
			</div>
			<Alert
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				handleConfirmButton={() => {
					deletePost();
					setIsDeleteModalOpen(false);
				}}
				confirmLabel="삭제">
				게시글을 삭제하시겠습니까?
			</Alert>
		</>
	);
}
