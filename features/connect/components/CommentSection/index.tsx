"use client";

import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import CommentCard from "@/features/connect/components/CommentCard";
import { mapCommentToCard } from "@/features/connect/comment/mappers";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";
import { useCreateComment } from "@/features/connect/mutations";
import Loading from "@/components/ui/Loading";
import { useGetPostDetail } from "@/features/connect/queries";
import type { ConnectPost } from "@/features/connect/post/types";

interface CommentSectionProps {
	postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
	const [comment, setComment] = useState("");
	const [visibleCount, setVisibleCount] = useState(3);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const { user } = useUserStore();
	const currentUserId = user?.id;
	const { handleShowToast } = useToast();

	const { data, isLoading } = useGetPostDetail(postId);

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
			{ threshold: 1 },
		);

		observer.observe(loadMoreRef.current);

		return () => observer.disconnect();
	}, [visibleCount, data]);

	// 댓글 생성 mutation
	const mutation = useCreateComment(postId, () => setComment(""));

	if (isLoading) return <Loading />;
	if (!data) return null;

	const comments = data?.comments ?? [];

	const sortedComments = [...comments].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	const visibleComments = sortedComments.slice(0, visibleCount);

	const handleSubmit = () => {
		if (!comment.trim()) return;
		if (!currentUserId) {
			handleShowToast({ message: "로그인이 필요합니다.", status: "error" });
			return;
		}
		mutation.mutate({ postId, content: comment });
	};

	return (
		<section>
			{/* 댓글 개수 */}
			<header className="flex h-6 w-full items-center text-base font-medium tracking-[-0.02rem] md:h-8">
				<span>댓글</span>
				<span className="font-semibold text-purple-600">{comments.length}</span>
			</header>

			{/* 댓글 입력 영역 */}
			<div className="mt-3 flex items-center md:mt-4 lg:mt-8">
				<div className="pr-4">
					<Image src="/assets/img/img_profile.svg" alt="profile" width={54} height={54} />
				</div>

				<div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-gray-100 px-[10px] py-[10px]">
					<InputTextarea
						name="comment"
						placeholder="여기에 댓글을 남겨보세요"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="max-h-[3.25rem] min-h-12 min-w-0 flex-1 bg-gray-100"
					/>
					<Button
						onClick={handleSubmit}
						className="r-[10px] h-12 w-8 rounded-[0.75rem] px-6 py-2 text-base font-semibold">
						등록
					</Button>
				</div>
			</div>

			{/* 댓글 리스트 */}
			<ul className="mt-6 flex flex-col gap-2 md:mt-8">
				{visibleComments.map((comment) => {
					const mapped = mapCommentToCard(comment);

					return (
						<li key={mapped.id}>
							<CommentCard
								{...mapped}
								postId={postId}
								authorId={comment.author.id}
								currentUserId={user?.id ?? null}
								isPending={
									(comment as ConnectPost["comments"][number] & { isPending?: boolean }).isPending
								}
							/>
						</li>
					);
				})}
			</ul>

			{/* 무한스크롤 트리거 */}
			<div ref={loadMoreRef} className="h-10" />

			{/* 하단 로딩 */}
			{isFetchingMore && <Loading />}
		</section>
	);
}
