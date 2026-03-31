import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/features/connect/ui/Loading";
import { serverFetch } from "@/libs/serverFetch";
import IntroSection from "@/features/connect/components/IntroSection";
import { CompactCardSkeleton } from "@/features/connect/components/CompactCard/Skeleton";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = new QueryClient();

	const sortBy = "likeCount";
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
				const res = await serverFetch(`/posts?type=best&limit=4`);

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
			<Container>
				<IntroSection />
				<Suspense
					fallback={
						<section className="mt-[81px]">
							<h2 className="text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
								이번주 HOT 게시물!
							</h2>
							<div className="mt-6 flex gap-6">
								{Array.from({ length: 4 }).map((_, i) => (
									<CompactCardSkeleton key={i} />
								))}
							</div>
						</section>
					}>
					<HotPostSection />
				</Suspense>
				<div className="mt-[98px] pb-[140px]">
					<Suspense fallback={<Loading />}>
						<PostContainer page={page} />
					</Suspense>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
