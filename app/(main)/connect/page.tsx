import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchPosts } from "@/features/connect/apis/fetchPosts";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;
	const page = Number(pageParam ?? 1);

	const queryClient = new QueryClient(); // 캐시저장소+ 쿼리 관리자(데이터를 담아두는 통 )

	await queryClient.prefetchQuery({
		queryKey: ["posts", page],
		queryFn: () => fetchPosts(page),
		staleTime: 1000 * 60,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Container className="border border-2">
				<div className="mt-12">
					{/* 임시 문구 영역 */}
					<div className="h-[91px] border border-gray-300 bg-gray-100">커넥트 토크 임시</div>
				</div>
				<div className="mt-[81px]">
					{/* HOT 게시물 */}
					<div className="h-[304px] border border-gray-300 bg-gray-100">
						{/* 제목 */}
						<h2 className="h-[32px] w-[187px] text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
							이번주 HOT 게시물!
						</h2>
					</div>
				</div>
				<div className="mt-[98px] pb-[140px]">
					{/* 게시글 영역 */}
					<div className="-mx-4 border border-gray-300 bg-gray-100">
						{/* 검색 h-[44px] max-w-[1280px] */}
						<PostContainer page={page} />
					</div>
				</div>
			</Container>
		</HydrationBoundary>
	);
}
