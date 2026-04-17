import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/getQueryClient";
import { Suspense } from "react";
import { serverFetch } from "@/libs/serverFetch";
import IntroSection from "@/features/connect/components/IntroSection";
import { connectQueryKeys } from "@/features/shared/queryKeys/connect";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "커넥트",
};

type SortBy = "createdAt" | "likeCount" | "viewCount" | "commentCount";
const VALID_SORT_BY: SortBy[] = ["createdAt", "likeCount", "viewCount", "commentCount"];

export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; sortBy?: string; keyword?: string }>;
}) {
	const { page: pageParam, sortBy: sortByParam, keyword: keywordParam } = await searchParams;
	const page = Number(pageParam ?? 1);
	const sortBy: SortBy = VALID_SORT_BY.includes(sortByParam as SortBy)
		? (sortByParam as SortBy)
		: "createdAt";
	const keyword = keywordParam ?? "";
	const LIMIT = 5;

	const queryClient = getQueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: connectQueryKeys.list(page, sortBy, LIMIT, keyword),
			queryFn: async () => {
				const queryParams = new URLSearchParams({
					type: "all",
					sortBy,
					offset: String((page - 1) * LIMIT),
					limit: String(LIMIT),
					...(keyword ? { keyword } : {}),
				});
				const res = await serverFetch(`/posts?${queryParams.toString()}`);
				if (!res.ok) throw new Error("게시글 조회 실패");
				return res.json();
			},
			staleTime: 1000 * 60,
		}),
		queryClient.prefetchQuery({
			queryKey: connectQueryKeys.hotPosts,
			queryFn: async () => {
				const res = await serverFetch(`/posts?type=best&limit=20`);
				if (!res.ok) throw new Error("HOT 게시글 조회 실패");
				return res.json();
			},
			staleTime: 1000 * 60 * 5,
		}),
		queryClient.prefetchQuery({
			queryKey: connectQueryKeys.list(1, "createdAt", 1, ""),
			queryFn: async () => {
				const res = await serverFetch(`/posts?type=all&sortBy=createdAt&offset=0&limit=1`);
				if (!res.ok) throw new Error("조회수 조회 실패");
				return res.json();
			},
			staleTime: 1000 * 60,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Container className="min-w-[380px] px-0 md:px-6 lg:px-7">
				<IntroSection />
				<QueryErrorBoundary prefix="HOT 게시글을">
					<Suspense fallback={null}>
						<HotPostSection />
					</Suspense>
				</QueryErrorBoundary>
				<div className="mt-8 pb-10 md:pb-[8.75rem]">
					<QueryErrorBoundary prefix="게시글을">
						<Suspense fallback={null}>
							<PostContainer />
						</Suspense>
					</QueryErrorBoundary>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
