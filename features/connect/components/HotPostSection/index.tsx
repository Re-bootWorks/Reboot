"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import type { Post } from "@/features/connect/types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../apis/fetchPosts";

export default function HotPostSection() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["hotPosts"],
		queryFn: () =>
			fetchPosts({
				type: "best",
				limit: 4,
			}),
	});
	const posts: Post[] = data?.data ?? [];
	const router = useRouter();

	if (isLoading) {
		return <section>로딩중...</section>;
	}

	if (error) {
		return <section>에러 발생</section>;
	}

	if (!posts.length) {
		return null; // 나중에 스켈레톤 ui 추가
	}
	return (
		<section>
			<div className="flex gap-6">
				{posts.map((post) => (
					<CompactCard
						key={post.id}
						id={post.id}
						title={post.title}
						image={post.image}
						createdAt={post.createdAt}
						likeCount={post.likeCount}
						commentCount={post._count.comments}
						onClick={() => router.push(`/connect/${post.id}`)}
					/>
				))}
			</div>
		</section>
	);
}
