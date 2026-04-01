import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { serverFetch } from "@/libs/serverFetch";
import IntroSection from "@/features/connect/components/IntroSection";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = new QueryClient();

	const sortBy = "createdAt";
	const LIMIT = 5;

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["posts", page, sortBy, LIMIT, ""],
			queryFn: async () => {
				const queryParams = new URLSearchParams({
					type: "all",
					sortBy,
					offset: String((page - 1) * LIMIT),
					limit: String(LIMIT),
				});

				const res = await serverFetch(`/posts?${queryParams.toString()}`);

				if (!res.ok) {
					throw new Error("게시글 조회 실패");
				}

				return res.json();
			},
			staleTime: 1000 * 60,
		}),
		queryClient.prefetchQuery({
			queryKey: ["hotPosts"],
			queryFn: async () => {
				const res = await serverFetch(`/posts?type=best&limit=20`);

				if (!res.ok) {
					throw new Error("HOT 게시글 조회 실패");
				}

				return res.json();
			},
			staleTime: 1000 * 60 * 5,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Container className="min-w-[380px]">
				<IntroSection />
				<Suspense fallback={null}>
					<HotPostSection />
				</Suspense>
				<div className="mt-[6.125rem] pb-[8.75rem]">
					<Suspense fallback={null}>
						<PostContainer page={page} />
					</Suspense>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
