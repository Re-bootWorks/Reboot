"use client";

import Container from "@/components/layout/Container";
import SearchInput from "@/components/ui/SearchInput";
import FilterButton from "@/components/ui/Buttons/FilterButton";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import type { Post } from "@/features/connect/types";
import { getMockPosts } from "@/features/connect/apis/mockPosts";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/features/connect/apis/fetchPosts";
import { useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";

export default function PostContainer({
	data: initialData,
	page,
}: {
	data: { data: Post[] };
	page: number;
}) {
	const { data } = useQuery({
		queryKey: ["posts", page],
		queryFn: () => fetchPosts(page),
		initialData,
		staleTime: 1000 * 60, //최소 1분
		placeholderData: keepPreviousData,
	});

	const posts = data?.data?.length //게시글 리스트
		? data.data
		: getMockPosts(page).data;

	const router = useRouter();

	return (
		<Container>
			{/* 검색 + 정렬 */}
			<div className="-mx-4 flex items-center justify-between pb-[16px]">
				<SearchInput placeholder="궁금한 내용을 검색해보세요." />
				<FilterButton label="최신순" />
			</div>

			{/* 게시글 목록 */}
			<div className="-mx-4 flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{posts.map((post: Post) => (
					<PostCard
						key={post.id}
						title={post.title}
						description={post.content}
						imageUrl={post.image}
						author={post.author.name}
						date={new Date(post.createdAt).getTime()}
						likeCount={post.likeCount}
						commentCount={post._count.comments}
					/>
				))}
			</div>
			{/* 페이지 이동 */}
			<div className="flex items-center justify-center pt-10">
				<Pagination
					currentPage={page}
					totalPages={9}
					handlePageChange={(newPage) => {
						router.push(`?page=${newPage}`, { scroll: false });
					}}
				/>
			</div>
		</Container>
	);
}
