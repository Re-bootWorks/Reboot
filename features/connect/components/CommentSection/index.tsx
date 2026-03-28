"use client";

import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import CommentCard from "@/features/connect/components/CommentCard";
import { mapCommentToCard } from "@/features/connect/comment/mappers";
import type { Comment } from "@/features/connect/comment/types";
import { useState } from "react";

interface CommentSectionProps {
	comments: Comment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
	const [comment, setComment] = useState("");

	const handleSubmit = () => {
		if (!comment.trim()) return;

		console.log("댓글:", comment);

		setComment(""); // 입력 초기화
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
				<div className="pr-1">
					<Image src="/assets/img/img_profile.svg" alt="profile" width={54} height={54} />
				</div>

				<div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-gray-100 p-[6px] pl-3">
					<InputTextarea
						name="comment"
						placeholder="여기에 댓글을 남겨보세요"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="max-h-[3.25rem] min-h-12 min-w-0 flex-1 bg-gray-100"
					/>
					<Button
						onClick={handleSubmit}
						className="w-10 rounded-[10px] px-4 text-base font-semibold">
						등록
					</Button>
				</div>
			</div>

			{/* 댓글 리스트 */}
			<ul className="mt-6 flex flex-col gap-2 md:mt-8">
				{comments.map((comment) => {
					const mapped = mapCommentToCard(comment);

					return (
						<li key={mapped.id}>
							<CommentCard {...mapped} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
