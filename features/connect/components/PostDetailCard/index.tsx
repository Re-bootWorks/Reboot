"use client";

import Image from "next/image";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import dayjs from "@/libs/dayjs";
import { useRouter } from "next/navigation";
import { useDeletePost, useToggleConnectLike } from "@/features/connect/mutations";
import Alert from "@/components/ui/Modals/AlertModal";
import { useState } from "react";

interface Props {
	id: number;
	title: string;
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
	const { mutate: deletePost } = useDeletePost(id);
	const { mutate: toggleLike } = useToggleConnectLike(id);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	return (
		<>
			<div className="w-full rounded-[48px] bg-white px-6 pt-6 pb-5 md:px-10 md:pt-10 md:pb-9 lg:px-16 lg:pt-16 lg:pb-14">
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
				<div className="mt-3 flex items-center gap-2 text-sm text-gray-500 md:mt-5">
					<img src="/assets/img/img_profile.svg" alt="profile" className="h-4 w-4" />
					<span>
						{author} · {dayjs(createdAt).format("YYYY.MM.DD")}
					</span>
				</div>
				{/* 내용 */}
				<div
					className="mt-6 min-h-[140px] text-base leading-6 tracking-[-0.32px] text-gray-700 md:mt-10 [&_img]:my-4 [&_img]:rounded-[24px]"
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
					<RelativeTime date={date} />

					<div className="flex items-center gap-3">
						{/* 좋아요 */}
						<button
							onClick={() => toggleLike(isLiked)}
							className="flex items-center gap-1 text-gray-500">
							<IcThumbOutline color={isLiked ? "purple-500" : "gray-400"} />
							<span className={isLiked ? "text-purple-500" : ""}>{likeCount}</span>
						</button>

						{/* 댓글 */}
						<div className="flex items-center gap-1 text-gray-500">
							<IcMessageOutline color="gray-400" />
							<span>{commentCount}</span>
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
