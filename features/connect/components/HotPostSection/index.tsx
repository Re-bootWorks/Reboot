"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import { getMockPosts } from "@/features/connect/apis/mockPosts";
import type { Post } from "@/features/connect/types";
import { useRouter } from "next/navigation";

export default function HotPostSection() {
	const data = getMockPosts(1); // 일단 mock
	const posts: Post[] = data.data;
	const router = useRouter();

	return (
		<section>
			<div className="flex gap-6">
				{posts.slice(0, 4).map((post) => (
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
