"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import CommentSection from "@/features/connect/components/CommentSection";
import PostDetailCard from "@/features/connect/components/PostDetailCard";
import Container from "@/components/layout/Container";
import { useUserStore } from "@/store/user.store";

export default function PostDetailContainer({ id }: { id: number }) {
	const { data } = useQuery({
		queryKey: ["postDetail", id],
		queryFn: () => getPostDetailClient(id),
	});

	const { user } = useUserStore();
	const isAuthor = !!user && user.id === data?.authorId;

	if (!data) return null;

	return (
		<Container narrow className="mt-[4.5rem]">
			<div className="flex flex-col gap-6 md:gap-8">
				<PostDetailCard
					id={data.id}
					title={data.title}
					content={data.content}
					imageUrl={data.imageUrl}
					author={data.author.name}
					createdAt={data.createdAt}
					likeCount={data.likeCount}
					commentCount={data._count?.comments ?? 0}
					date={new Date(data.createdAt).getTime()}
					isAuthor={isAuthor}
				/>

				<CommentSection postId={data.id} />
			</div>
		</Container>
	);
}
