"use client";

import Container from "@/components/layout/Container";
import SearchInput from "@/components/ui/SearchInput";
import FilterButton from "@/components/ui/Buttons/FilterButton";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/features/connect/apis";
import type { Post } from "@/features/connect/types";

export default function PostContainer() {
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useQuery<{
		data: Post[];
	}>({
		queryKey: ["posts", page],
		queryFn: () => fetchPosts(page),
	});
	if (isLoading) return <div>로딩중...</div>;
	if (error) return <div>에러 발생</div>;

	console.log("data:", data);

	return (
		<Container>
			{/* 검색 + 정렬 */}
			<div className="-mx-4 flex items-center justify-between pb-[16px]">
				<SearchInput placeholder="궁금한 내용을 검색해보세요." />

				<FilterButton label="최신순" />
			</div>
			{/* 게시글 리스트 */}
			<div className="-mx-4 flex flex-col gap-12 bg-white px-8 py-8">
				{data?.data.map((post) => (
					<div key={post.id}>
						<p>{post.content}</p>
						<PostCard
							title={post.title}
							description={post.content}
							imageUrl={post.image}
							author={post.author.name}
							date={new Date(post.createdAt).getTime()}
							likeCount={post.likeCount}
							commentCount={post._count.comments}
						/>
					</div>
				))}
			</div>
			{/* 페이지 이동 */}
			<div className="flex items-center justify-center pt-[40px]">
				<Pagination currentPage={page} totalPages={9} handlePageChange={setPage} />
			</div>
		</Container>
	);
}
