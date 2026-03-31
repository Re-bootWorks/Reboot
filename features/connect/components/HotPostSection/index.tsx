"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import type { Post } from "@/features/connect/post/types";
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
		return null;
	}
	return (
		<section className="mt-[81px]">
			{/* 제목 */}
			<h2 className="text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
				이번주 HOT 게시물!
			</h2>

			{/* 카드 영역 */}
			<div className="mt-6 flex gap-6">
				{posts.slice(0, 4).map((post) => (
					<CompactCard
						key={post.id}
						{...post}
						commentCount={post._count.comments}
						onClick={() => router.push(`/connect/${post.id}`)}
					/>
				))}
			</div>
		</section>
	);
}
