"use client";

import { useGetPostDetail } from "@/features/connect/queries";
import CommentSection from "@/features/connect/components/CommentSection";
import PostDetailCard from "@/features/connect/components/PostDetailCard";
import Container from "@/components/layout/Container";
import { useUser } from "@/hooks/useUser";
export default function PostDetailContainer({ id }: { id: number }) {
	const { data } = useGetPostDetail(id);
	const { user } = useUser();
	const isAuthor = !!user && user.id === data?.authorId;

	if (!data) return null;

	return (
		<Container narrow className="mt-[4.5rem]">
			<div className="flex flex-col gap-6 md:gap-8">
				<PostDetailCard
					id={data.id}
					title={data.title}
					content={data.content}
					imageUrl={data.image}
					author={data.author.name}
					authorImage={data.author.image}
					createdAt={data.createdAt}
					likeCount={data.likeCount}
					commentCount={data.comments?.length ?? 0}
					date={new Date(data.createdAt).getTime()}
					isAuthor={isAuthor}
					isLiked={data.isLiked ?? false}
				/>
				<CommentSection postId={data.id} />
			</div>
		</Container>
	);
}
