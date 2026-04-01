import Container from "@/components/layout/Container";
import CompactCard from "@/features/connect/components/CompactCard";
import ConnectCard from "@/features/connect/components/PostCard";
import IntroSection from "@/features/connect/components/IntroSection";

export default function Loading() {
	return (
		<Container>
			<IntroSection />
			<section className="mt-[81px]">
				<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
				<div className="mt-6 flex gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<CompactCard.Skeleton key={i} />
					))}
				</div>
			</section>

			<div className="mt-[98px] space-y-4 pb-[140px]">
				{Array.from({ length: 5 }).map((_, i) => (
					<ConnectCard.Skeleton key={i} />
				))}
			</div>
		</Container>
	);
}
