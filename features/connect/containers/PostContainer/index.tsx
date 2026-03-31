"use client";

import SearchInput from "@/components/ui/SearchInput";
import FilterButton from "@/components/ui/Buttons/FilterButton";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
//import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { mapPostToCard } from "@/features/connect/post/mappers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/providers/toast-provider";

export default function PostContainer({ page }: { page: number }) {
	const [sortBy, setSortBy] = useState<"createdAt" | "likeCount">("likeCount");
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
		//placeholderData: keepPreviousData, // 페이지/필터 바뀌어도 깜빡임 없음 ,나중에 infiniteQuery에서 다시 사용
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
				<FilterButton
					label={sortBy === "createdAt" ? "최신순" : "좋아요순"}
					onClick={() => setSortBy((prev) => (prev === "createdAt" ? "likeCount" : "createdAt"))}
					className="pr-4"
				/>
			</div>

			{/* 게시글 목록 */}
			<div ref={containerRef} className="-mx-4 flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{mappedPosts.length === 0 ? (
					<div className="py-20 text-center text-gray-400">검색 결과가 없습니다</div>
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
