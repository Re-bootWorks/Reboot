import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";
import { getPosts } from "@/features/connect/apis/getPosts";

// 서버 컴포넌트
export default async function ConnectPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { page: pageParam } = await searchParams;

	const page = Number(pageParam ?? 1);

	// 서버에서 데이터 가져오기
	const data = await getPosts(page);
	return (
		<Container className="border border-2">
			<div className="mt-12">
				{/* 임시 문구 영역 */}
				<div className="-mx-4 h-[91px] max-w-[1280px] border border-gray-300 bg-gray-100">
					커넥트 토크 임시
				</div>
			</div>
			<div className="mt-[81px]">
				{/* HOT 게시물 */}
				<div className="-mx-4 h-[304px] max-w-[1280px] border border-gray-300 bg-gray-100">
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
					<PostContainer data={data} page={page} />
				</div>
			</div>
		</Container>
	);
}
