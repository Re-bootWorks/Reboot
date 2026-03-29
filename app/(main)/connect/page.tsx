import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/features/connect/ui/Loading";
import { serverFetch } from "@/libs/serverFetch";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = new QueryClient(); // 모든 쿼리/캐시가 여기에 저장

	const sortBy = "likeCount";
	const LIMIT = 10;

	await queryClient.prefetchQuery({
		queryKey: ["posts", page, sortBy],
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
	});

	return (
		// 서버에서 전달받은 캐시를 클라이언트 QueryClient에 주입
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Container>
				<div className="mt-12">
					{/* 임시 문구 영역 */}
					<div className="h-[91px] border border-gray-300">커넥트 토크 임시</div>
				</div>
				<div className="-mx-4 mt-[81px]">
					{/* HOT 게시물 */}
					<div className="h-[304px]">
						{/* 제목 */}
						<h2 className="h-[32px] w-[187px] text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
							이번주 HOT 게시물!
						</h2>
						<HotPostSection />
					</div>
				</div>
				<div className="mt-[98px] pb-[140px]">
					{/* 게시글 영역 */}
					<div className="-mx-4">
						<Suspense fallback={<Loading />}>
							<PostContainer page={page} />
						</Suspense>
					</div>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
