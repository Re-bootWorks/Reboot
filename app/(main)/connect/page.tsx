import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/getQueryClient";
import { Suspense } from "react";
import { serverFetch } from "@/libs/serverFetch";
import IntroSection from "@/features/connect/components/IntroSection";
import { connectQueryKeys } from "@/features/connect/queries";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = getQueryClient();
	const sortBy = "createdAt";
	const LIMIT = 5;

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: connectQueryKeys.list(page, sortBy, LIMIT, ""),
			queryFn: async () => {
				const queryParams = new URLSearchParams({
					type: "all",
					sortBy,
					offset: String((page - 1) * LIMIT),
					limit: String(LIMIT),
				});
				const res = await serverFetch(`/posts?${queryParams.toString()}`);
				if (!res.ok) throw new Error("게시글 조회 실패");
				return res.json();
			},
			staleTime: 1000 * 60,
		}),
		queryClient.prefetchQuery({
			queryKey: connectQueryKeys.hotPosts(),
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
