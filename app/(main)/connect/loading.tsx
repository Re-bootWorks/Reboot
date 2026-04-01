import Container from "@/components/layout/Container";
import CompactCard from "@/features/connect/components/CompactCard";
import ConnectCard from "@/features/connect/components/PostCard";
import IntroSection from "@/features/connect/components/IntroSection";
import SearchInput from "@/components/ui/SearchInput";

export default function Loading() {
	return (
		<Container>
			<IntroSection />

			{/* HOT 게시물 섹션 */}
			<section className="mt-[81px]">
				<h2 className="text-2xl leading-8 font-semibold tracking-[-0.03rem] whitespace-nowrap">
					이번주 HOT 게시물!
				</h2>
				<div className="mt-6 flex gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<CompactCard.Skeleton key={i} />
					))}
				</div>
			</section>

			{/* 게시글 목록 */}
			<div className="mt-[98px] pb-[140px]">
				{/* 검색 + 필터 */}
				<div className="flex items-center justify-between pb-4">
					<SearchInput placeholder="궁금한 내용을 검색해보세요." />
				</div>

				{/* 카드 목록 */}
				<div className="flex flex-col gap-2 rounded-3xl bg-white px-8 py-8 md:gap-12">
					{Array.from({ length: 5 }).map((_, i) => (
						<ConnectCard.Skeleton key={i} />
					))}
				</div>
			</div>
		</Container>
	);
}
