import { Suspense } from "react";
import PageIntro from "@/components/ui/PageIntro";
import ListControls from "@/features/reviews/components/ListControls";
import RatingSummary from "@/features/reviews/components/RatingSummary";
import ReviewsSection from "@/features/reviews/components/ReviewsSection";
import { RATING_SUMMARY } from "@/features/reviews/mockData";

export default function ReviewsPage() {
	return (
		<>
			<header className="mt-8.5 mb-8 md:mt-10 md:mb-14 lg:mt-[3.188rem]">
				<PageIntro />
			</header>

			<Suspense fallback={<></>}>
				<ListControls />
			</Suspense>
			<RatingSummary {...RATING_SUMMARY} />
			<ReviewsSection />
		</>
	);
}
