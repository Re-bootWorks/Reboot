"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import CommentSection from "@/features/connect/components/CommentSection";
import PostDetailCard from "@/features/connect/components/PostDetailCard";
import Container from "@/components/layout/Container";

export default function PostDetailContainer({ id }: { id: number }) {
	const { data } = useQuery({
		queryKey: ["postDetail", id],
		queryFn: () => getPostDetailClient(id),
	});

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
				/>

				<CommentSection postId={data.id} />
			</div>
		</Container>
	);
}
