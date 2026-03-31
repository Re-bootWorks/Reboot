"use client";

import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import CommentCard from "@/features/connect/components/CommentCard";
import { mapCommentToCard } from "@/features/connect/comment/mappers";
import type { Comment } from "@/features/connect/comment/types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/features/connect/apis/createComment";
import { useQuery } from "@tanstack/react-query";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";

interface CommentSectionProps {
	postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const currentUserId = user?.id;
	const { handleShowToast } = useToast();

	const { data } = useQuery<{ comments: Comment[] }>({
		queryKey: ["postComments", postId],
		queryFn: () => getPostDetailClient(postId),
	});

	const mutation = useMutation({
		mutationFn: createComment,

		onMutate: async (newComment: { postId: number; content: string }) => {
			await queryClient.cancelQueries({ queryKey: ["postDetail", postId] });

			const previousData = queryClient.getQueryData(["postDetail", postId]);

			queryClient.setQueryData(
				["postDetail", postId],
				(old: { comments?: Comment[] } | undefined) => ({
					//old:기존 캐시 데이터
					...old, // 기존 데이터 유지 + comments만 덮어쓰기
					comments: [
						{
							//임시 데이터 (fake 데이터)
							id: Date.now(),
							content: newComment.content,
							author: {
								id: currentUserId!,
								name: user?.name ?? "사용자",
							},
							createdAt: new Date().toISOString(),
							// 1. Optimistic으로 유저이름 표시
							// 2. 서버 응답 도착
							// 3. invalidateQueries 실행
							// 4. 진짜 데이터로 교체됨
						},
						...(old?.comments ?? []),
					],
				}),
			);

			return { previousData }; //새로운 캐시 데이터
		},

		onError: (_err, _newComment, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(["postDetail", postId], context.previousData);
			}
			handleShowToast({ message: "댓글 등록에 실패했습니다.", status: "error" });
		},

		onSuccess: () => {
			setComment(""); // 입력 비워줘버리기~
			queryClient.invalidateQueries({ queryKey: ["postDetail", postId] });
			//캐시를 무효화해서 데이터를 다시 불러오게 만드는 함수
		},
	});

	if (!data) return null;

	const comments = data?.comments ?? [];

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
				{[...comments]
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.map((comment) => {
						const mapped = mapCommentToCard(comment);

						return (
							<li key={mapped.id}>
								<CommentCard
									{...mapped}
									authorId={comment.author.id}
									currentUserId={user?.id ?? null}
								/>
							</li>
						);
					})}
			</ul>
		</section>
	);
}
