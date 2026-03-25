"use client";

import Container from "@/components/layout/Container";
import SearchInput from "@/components/ui/SearchInput";
import FilterButton from "@/components/ui/Buttons/FilterButton";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import type { Post } from "@/features/connect/types";
import { getMockPosts } from "@/features/connect/apis/mockPosts";
// import { fetchPosts } from "@/features/connect/apis/fetchPosts";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function PostContainer({ page }: { page: number }) {
	// const { data } = useQuery({
	// 	queryKey: ["posts", page],
	// 	queryFn: () => fetchPosts({
	// 		type: "all",
	// 		sortBy: "createdAt",
	// 		offset:(page -1) *10,
	// 		limit:10,
	// 	}),
	// });

	const { data } = useQuery({
		queryKey: ["posts", page],
		queryFn: () => Promise.resolve(getMockPosts(page)),
	});

	const posts = data?.data ?? [];

	const router = useRouter();
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Container>
			{/* 검색 + 정렬 */}
			<div className="-mx-4 flex items-center justify-between pb-4">
				<SearchInput placeholder="궁금한 내용을 검색해보세요." />
				<FilterButton label="최신순" />
			</div>

			{/* 게시글 목록 */}
			<div ref={containerRef} className="-mx-4 flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{posts.map((post: Post) => (
					<PostCard
						id={post.id}
						key={post.id}
						title={post.title}
						description={post.content}
						imageUrl={post.image}
						author={post.author.name}
						date={new Date(post.createdAt).getTime()}
						likeCount={post.likeCount}
						commentCount={post._count.comments}
						onClick={() => router.push(`/connect/${post.id}`)}
					/>
				))}
			</div>
			{/* 페이지 이동 */}
			<div className="flex items-center justify-center pt-10">
				<Pagination
					currentPage={page}
					totalPages={9}
					handlePageChange={(newPage) => {
						//페이지 이동시 게시글 목록까지만 스크롤 이동
						router.push(`?page=${newPage}`);

						setTimeout(() => {
							containerRef.current?.scrollIntoView({
								behavior: "smooth",
								block: "start",
							});
						}, 0);
					}}
				/>
			</div>
		</Container>
	);
}
