"use client";

import SearchInput from "@/components/ui/SearchInput";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import PostCard from "@/features/connect/components/PostCard";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { mapPostToCard } from "@/features/connect/post/mappers";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { useGetPosts } from "@/features/connect/queries";
import { AnimatePresence, motion } from "motion/react";
import { cardVariants } from "@/features/connect/animations";
import LoaderDots from "@/components/ui/LoaderDots";

const SORT_OPTIONS = [
	{ label: "최신순", value: "createdAt" },
	{ label: "좋아요순", value: "likeCount" },
	{ label: "조회수순", value: "viewCount" },
	{ label: "댓글 많은순", value: "commentCount" },
];

const LIMIT = 5;

type SortBy = "createdAt" | "likeCount" | "viewCount" | "commentCount";

export default function PostContainer() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { handleShowToast } = useToast();
	const deletedHandled = useRef(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [shouldScroll, setShouldScroll] = useState(false);

	// URL searchParams에서 초기값 읽기
	const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
	const [sortBy, setSortBy] = useState<SortBy>(
		(searchParams.get("sortBy") as SortBy) ?? "createdAt",
	);
	const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
	const [searchKeyword, setSearchKeyword] = useState(searchParams.get("keyword") ?? "");

	useEffect(() => {
		if (searchParams.get("deleted") === "true" && !deletedHandled.current) {
			deletedHandled.current = true;
			handleShowToast({ message: "게시글이 삭제됐습니다.", status: "success" });
			router.replace("/connect", { scroll: false });
		}
	}, [searchParams]);

	const { data, isFetching } = useGetPosts({ page, sortBy, keyword: searchKeyword, limit: LIMIT });

	useEffect(() => {
		if (!isFetching && shouldScroll) {
			const top = containerRef.current?.getBoundingClientRect().top ?? 0;
			window.scrollTo({ top: window.scrollY + top - 80, behavior: "smooth" });
			setShouldScroll(false);
		}
	}, [isFetching, shouldScroll]);

	// URL 업데이트 헬퍼
	const updateURL = (params: { page?: number; sortBy?: string; keyword?: string }) => {
		const current = new URLSearchParams(searchParams.toString());
		if (params.page !== undefined) current.set("page", String(params.page));
		if (params.sortBy !== undefined) current.set("sortBy", params.sortBy);
		if (params.keyword !== undefined) {
			if (params.keyword) {
				current.set("keyword", params.keyword);
			} else {
				current.delete("keyword");
			}
		}
		router.push(`?${current.toString()}`, { scroll: false });
	};

	const handleSearch = () => {
		setPage(1);
		setSearchKeyword(keyword);
		updateURL({ page: 1, sortBy, keyword });
	};

	const handleSortChange = (value: string) => {
		const newSortBy = value as SortBy;
		setSortBy(newSortBy);
		setPage(1);
		updateURL({ page: 1, sortBy: newSortBy, keyword: searchKeyword });
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		setShouldScroll(true);
		updateURL({ page: newPage, sortBy, keyword: searchKeyword });
	};

	const posts = data?.data ?? [];
	const totalCount = data?.totalCount ?? 0;
	const totalPages = Math.ceil(totalCount / LIMIT);
	const mappedPosts = posts.map(mapPostToCard);

	return (
		<div>
			{/* 검색 + 정렬 */}
			<div ref={containerRef} className="flex items-center justify-between pb-4">
				<SearchInput
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSearch();
					}}
					onSearchClick={handleSearch}
					onClear={() => {
						setKeyword("");
						setSearchKeyword("");
						updateURL({ page: 1, sortBy, keyword: "" });
					}}
					placeholder="궁금한 내용을 검색해보세요."
				/>
				<FilterDropdown value={sortBy} items={SORT_OPTIONS} onChange={handleSortChange} />
			</div>

			{/* 게시글 목록 */}
			<div className="relative flex flex-col gap-12 rounded-3xl bg-white px-8 py-8">
				{isFetching && (
					<div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60">
						<LoaderDots size="lg" />
					</div>
				)}
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
					<AnimatePresence mode="popLayout">
						{mappedPosts.map((post, i) => (
							<motion.div
								key={post.id}
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								custom={i}>
								<PostCard {...post} onClick={() => router.push(`/connect/${post.id}`)} />
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>

			{/* 페이지 이동 */}
			<div className="flex items-center justify-center pt-10">
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					handlePageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
