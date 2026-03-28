"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import type { Post } from "@/features/connect/types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";

export default function HotPostSection() {
	const { data, isLoading } = useQuery({
		queryKey: ["hotPosts"],
		queryFn: () =>
			fetchPostsClient({
				type: "best",
				limit: 4,
			}),
		staleTime: 1000 * 60 * 5, // 5분 캐싱
		retry: 1, // 과한 재요청 방지
	});
	const posts: Post[] = data?.data ?? [];
	const router = useRouter();

	if (isLoading) {
		return <section>로딩중...</section>; //나중에 스켈레톤 ui 추가
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
