"use client";

import CompactCard from "@/features/connect/components/CompactCard";
import type { Post } from "@/features/connect/post/types";
import { useRouter } from "next/navigation";
import { mapPostToCard } from "@/features/connect/post/mappers";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { useGetHotPosts } from "@/features/connect/queries";
import { AnimatePresence, motion } from "motion/react";
import { cardVariants } from "@/features/connect/animations";

export default function HotPostSection() {
	const { ref, style, overlays, ...events } = useDragScroll<HTMLDivElement>({
		fadeColor: "#F6F7F9",
	});
	const { data } = useGetHotPosts();
	const posts: Post[] = data?.data ?? [];
	const router = useRouter();

	if (!posts.length) {
		return null;
	}

	return (
		<section className="mt-[81px] min-w-0 overflow-hidden">
			<h2 className="text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
				이번주 HOT 게시물!
			</h2>
			<div className="relative mt-6">
				<div ref={ref} style={style} className={`${containerStyle} flex gap-6`} {...events}>
					<AnimatePresence mode="popLayout">
						{posts.map((post, i) => {
							const mapped = mapPostToCard(post);
							return (
								<motion.div
									key={post.id}
									variants={cardVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									custom={i}>
									<CompactCard
										id={post.id}
										title={mapped.title}
										image={mapped.imageUrl ?? ""}
										createdAt={post.createdAt}
										likeCount={mapped.likeCount}
										commentCount={mapped.commentCount}
										onClick={() => router.push(`/connect/${post.id}`)}
									/>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
				{overlays}
			</div>
		</section>
	);
}
