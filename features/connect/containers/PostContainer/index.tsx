"use client";

import Container from "@/components/layout/Container";
import SearchInput from "@/components/ui/SearchInput";
import FilterButton from "@/components/ui/Buttons/FilterButton";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
//import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { mapPostToCard } from "@/features/connect/post/mappers";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function PostContainer({ page }: { page: number }) {
	const [sortBy, setSortBy] = useState<"createdAt" | "likeCount">("likeCount");

	const { data } = useSuspenseQuery({
		queryKey: ["posts", page, sortBy],
		queryFn: () =>
			fetchPostsClient({
				type: "all",
				sortBy,
				offset: (page - 1) * 10,
				limit: 10,
			}),
		staleTime: 1000 * 60,
		//placeholderData: keepPreviousData, // 페이지/필터 바뀌어도 깜빡임 없음 ,나중에 infiniteQuery에서 다시 사용
	});

	const posts = data?.data ?? [];

	const router = useRouter();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const mappedPosts = posts.map(mapPostToCard) as ReturnType<typeof mapPostToCard>[];

	if (!mappedPosts.length) {
		return <div>게시글이 없습니다</div>;
	}

	return (
		<Container>
			{/* 검색 + 정렬 */}
			<div className="-mx-4 flex items-center justify-between pb-4">
				<SearchInput placeholder="궁금한 내용을 검색해보세요." />
				<FilterButton
					label={sortBy === "createdAt" ? "최신순" : "좋아요순"}
					onClick={() => setSortBy((prev) => (prev === "createdAt" ? "likeCount" : "createdAt"))}
				/>
			</div>

			{/* 게시글 목록 */}
			<div ref={containerRef} className="-mx-4 flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{mappedPosts.map((post) => (
					<PostCard key={post.id} {...post} onClick={() => router.push(`/connect/${post.id}`)} />
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
