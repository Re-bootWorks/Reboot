"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import type { Post } from "@/features/connect/post/types";
import { useRouter } from "next/navigation";
import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { mapPostToCard } from "@/features/connect/post/mappers";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";

export default function HotPostSection() {
	const { ref, style, overlays, ...events } = useDragScroll<HTMLDivElement>({
		fadeColor: "#F6F7F9",
	});
	const { data } = useSuspenseQuery({
		queryKey: ["hotPosts"],
		queryFn: () => fetchPostsClient({ type: "best", limit: 4 }),
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
	const posts: Post[] = data?.data ?? [];
	const router = useRouter();

	if (!posts.length) {
		return null;
	}
	return (
		<section className="mt-[81px] min-w-0 overflow-hidden">
			{/* 제목 */}
			<h2 className="text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
				이번주 HOT 게시물!
			</h2>

			{/* 카드 영역 */}
			<div className="relative mt-6">
				<div ref={ref} style={style} className={`${containerStyle} flex gap-6`} {...events}>
					{posts.slice(0, 4).map((post) => {
						const mapped = mapPostToCard(post);
						return (
							<CompactCard
								key={post.id}
								id={post.id}
								title={mapped.title}
								image={mapped.imageUrl ?? ""}
								createdAt={post.createdAt}
								likeCount={mapped.likeCount}
								commentCount={mapped.commentCount}
								onClick={() => router.push(`/connect/${post.id}`)}
							/>
						);
					})}
				</div>
				{overlays}
			</div>
		</section>
	);
}
