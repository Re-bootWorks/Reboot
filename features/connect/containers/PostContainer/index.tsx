"use client";

import SearchInput from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { mapPostToCard } from "@/features/connect/post/mappers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/providers/toast-provider";

const SORT_OPTIONS = [
	{ label: "최신순", value: "createdAt" },
	{ label: "좋아요순", value: "likeCount" },
	{ label: "조회수순", value: "viewCount" },
	{ label: "댓글 많은순", value: "commentCount" },
];
export default function PostContainer({ page }: { page: number }) {
	const [sortBy, setSortBy] = useState<"createdAt" | "likeCount" | "viewCount" | "commentCount">(
		"createdAt",
	);
	const searchParams = useSearchParams();
	const { handleShowToast } = useToast();
	const deletedHandled = useRef(false);
	const [keyword, setKeyword] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement | null>(null);

	// 삭제 토스트 처리
	useEffect(() => {
		if (searchParams.get("deleted") === "true" && !deletedHandled.current) {
			deletedHandled.current = true;
			handleShowToast({ message: "게시글이 삭제됐습니다.", status: "success" });
			router.replace("/connect", { scroll: false });
		}
	}, [searchParams]);

	// 데이터 가져오기
	const { data } = useSuspenseQuery({
		queryKey: ["posts", page, sortBy, 5, searchKeyword],
		queryFn: () =>
			fetchPostsClient({
				type: "all",
				sortBy,
				keyword: searchKeyword,
				offset: (page - 1) * 5,
				limit: 5,
			}),
		staleTime: 1000 * 60,
	});

	const handleSearch = () => {
		setSearchKeyword(keyword);
		router.push("?page=1", { scroll: false });
	};

	// 데이터 처리
	const posts = data?.data ?? [];
	const totalCount = data?.totalCount ?? 0;
	const totalPages = Math.ceil(totalCount / 5);

	const mappedPosts = posts.map(mapPostToCard);

	return (
		<div>
			{/* 검색 + 정렬 */}
			<div className="-mx-4 flex items-center justify-between pb-4">
				<SearchInput
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSearch();
						}
					}}
					onSearchClick={handleSearch}
					placeholder="궁금한 내용을 검색해보세요."
				/>
				<FilterDropdown
					value={sortBy}
					items={SORT_OPTIONS}
					onChange={(value) => setSortBy(value as typeof sortBy)}
				/>
			</div>

			{/* 게시글 목록 */}
			<div ref={containerRef} className="-mx-4 flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{mappedPosts.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 py-20">
						<img
							src="/assets/img/img_empty.svg"
							alt="게시물 없음"
							className="h-[120px] w-[120px]"
						/>
						<p className="text-sm text-gray-400">아직 게시물이 없어요</p>
					</div>
				) : (
					mappedPosts.map((post) => (
						<PostCard key={post.id} {...post} onClick={() => router.push(`/connect/${post.id}`)} />
					))
				)}
			</div>
			{/* 페이지 이동 */}
			<div className="flex items-center justify-center pt-10">
				<Pagination
					currentPage={page}
					totalPages={totalPages}
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
		</div>
	);
}
