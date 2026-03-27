import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import HotPostSection from "@/features/connect/components/HotPostSection";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { GetPostsParams } from "@/features/connect/types";
import { Suspense } from "react";
import Loading from "@/features/connect/components/ui/Loading";
import { serverFetch } from "@/libs/serverFetch";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = new QueryClient(); // 캐시저장소+ 쿼리 관리자(데이터를 담아두는 통 )

	const sortBy = "likeCount";

	const params: GetPostsParams = {
		type: "all",
		sortBy: "createdAt",
		offset: (page - 1) * 10,
		limit: 10,
	};

	await queryClient.prefetchQuery({
		queryKey: ["posts", page, sortBy],
		queryFn: async () => {
			const res = await serverFetch(
				`/posts?type=all&sortBy=${sortBy}&offset=${(page - 1) * 10}&limit=10`,
			);

			if (!res.ok) {
				throw new Error("게시글 조회 실패");
			}

			return res.json();
		},
		staleTime: 1000 * 60,
	});

	return (
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
