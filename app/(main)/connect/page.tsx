import Container from "@/components/layout/Container";
import PostContainer from "@/features/connect/containers/PostContainer";

export default function ConnectPage() {
	return (
		<Container className="border border-2">
			<div className="mt-[51px]">
				{/* 임시 문구 영역 */}
				<div className="-mx-4 h-[91px] max-w-[1280px] border border-gray-300 bg-gray-100">
					커넥트 토크 임시
				</div>
			</div>
			<div className="mt-[81px]">
				{/* HOT 게시물 */}
				<div className="-mx-4 h-[304px] max-w-[1280px] border border-gray-300 bg-gray-100">
					{/* 제목 */}
					<h2 className="trackging-[-0.03rem] h-[32px] w-[187px] text-2xl leading-8 font-semibold whitespace-nowrap">
						이번주 HOT 게시물!
					</h2>
				</div>
			</div>
			<div className="mt-[98px] pb-[140px]">
				{/* 게시글 영역 */}
				<div className="-mx-4 border border-gray-300 bg-gray-100">
					{/* 검색 h-[44px] max-w-[1280px] */}
					<PostContainer />
				</div>
			</div>
		</Container>
	);
}
