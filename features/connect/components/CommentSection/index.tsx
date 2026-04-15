"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { useCreateComment } from "@/features/connect/mutations";
import { useGetPostDetail } from "@/features/connect/queries";
import CommentCard from "@/features/connect/components/CommentCard";
import { mapCommentToCard } from "@/features/connect/comment/mappers";
import type { ConnectPost } from "@/features/connect/post/types";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/providers/toast-provider";
import CommentInput from "@/features/connect/components/CommentCard/CommentInput";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import { AnimatePresence, motion } from "motion/react";
import { commentVariants } from "@/features/connect/animations";

interface CommentSectionProps {
	postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
	// 상태
	const [visibleCount, setVisibleCount] = useState(3);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	// 스토어 / 공통
	const { user } = useUser();
	const { handleShowToast } = useToast();

	// 쿼리 / 뮤테이션
	const { data, isLoading } = useGetPostDetail(postId);
	const mutation = useCreateComment(postId);

	// 파생 변수
	const currentUserId = user?.id;
	const comments = data?.comments ?? [];
	const sortedComments = [...comments].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
	const visibleComments = sortedComments.slice(0, visibleCount);

	// 무한스크롤
	useEffect(() => {
		if (!loadMoreRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < (data?.comments?.length ?? 0)) {
					setIsFetchingMore(true);

					setTimeout(() => {
						setVisibleCount((prev) => Math.min(prev + 3, data?.comments?.length ?? 0));
						setIsFetchingMore(false);
					}, 300);
				}
			},
			{ threshold: 0 },
		);

		observer.observe(loadMoreRef.current);

		return () => observer.disconnect();
	}, [visibleCount, data]);

	// 핸들러
	const handleSubmit = (content: string) => {
		if (!currentUserId) {
			handleShowToast({ message: "로그인이 필요합니다.", status: "error" });
			return;
		}
		mutation.mutate({ postId, content });
	};

	if (isLoading) return <Loading />;
	if (!data) return null;

	return (
		<section>
			{/* 댓글 개수 */}
			<header className="flex h-6 w-full items-center gap-1 text-base font-medium tracking-[-0.02rem] md:h-8">
				<IcMessageOutline color="gray-700" size={18} />
				<span>댓글</span>
				<span className="font-semibold text-purple-600">{comments.length}</span>
			</header>

			{/* 댓글 입력 영역 */}
			<div className="mt-3 flex items-center border-b border-gray-200 pb-4 md:mt-4 lg:mt-8">
				<div className="relative mr-4 h-14 w-14 shrink-0 overflow-hidden rounded-full">
					{user?.image ? (
						<Image src={user.image} alt="profile" fill className="object-cover" />
					) : (
						<Image src="/assets/img/img_profile.svg" alt="profile" fill className="object-cover" />
					)}
				</div>

				<CommentInput onSubmit={handleSubmit} isPending={mutation.isPending} />
			</div>

			{/* 댓글 리스트 */}
			<ul className="flex flex-col gap-2">
				<AnimatePresence mode="popLayout">
					{visibleComments.map((comment, i) => {
						const mapped = mapCommentToCard(comment);
						return (
							<motion.li
								key={mapped.id}
								variants={commentVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								custom={i}>
								<CommentCard
									{...mapped}
									postId={postId}
									authorId={comment.author.id}
									currentUserId={user?.id ?? null}
									isPending={
										(comment as ConnectPost["comments"][number] & { isPending?: boolean }).isPending
									}
								/>
							</motion.li>
						);
					})}
				</AnimatePresence>
			</ul>
			{/* 무한스크롤 트리거 */}
			<div ref={loadMoreRef} className="h-10" />

			{/* 하단 로딩 */}
			{isFetchingMore && <Loading />}
		</section>
	);
}
