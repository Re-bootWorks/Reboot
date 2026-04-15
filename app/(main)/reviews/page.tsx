import { Suspense } from "react";
import PageIntro from "@/components/ui/PageIntro";
import ListControls from "@/features/reviews/components/ListControls";
import RatingSummary from "@/features/reviews/components/RatingSummary";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ReviewsListRequest } from "@/features/reviews/types";
import {
	prefetchReviewsStatistics,
	prefetchReviews,
	prefetchReviewsCategoriesStatistics,
} from "@/features/reviews/queries/prefetchQueries";
import RatingSummarySkeleton from "@/features/reviews/components/RatingSummary/RatingSummarySkeleton";
import ReviewsSection from "@/features/reviews/components/ReviewsCard/ReviewsSectionWrapper/ReviewsSection";
import QueryErrorBoundary from "@/components/common/QueryErrorBoundary";
import { getQueryClient } from "@/libs/getQueryClient";

type Props = {
	searchParams: Promise<ReviewsListRequest>;
};

export default async function ReviewsPage({ searchParams }: Props) {
	const params = await searchParams;

	const queryClient = getQueryClient();

	const normalizedParams: ReviewsListRequest = {
		type: params.type,
		region: params.region,
		dateStart: params.dateStart,
		dateEnd: params.dateEnd,
		registrationEndStart: params.registrationEndStart,
		registrationEndEnd: params.registrationEndEnd,
		sortBy: params.sortBy,
		sortOrder: params.sortOrder,
		size: params.size,
	};

	await prefetchReviewsStatistics(queryClient);
	await prefetchReviewsCategoriesStatistics(queryClient);
	await prefetchReviews(queryClient, normalizedParams);

	return (
		<>
			<header className="mt-8.5 mb-8 md:mt-10 md:mb-14 lg:mt-[3.188rem]">
				<PageIntro />
			</header>

			<ListControls />

			<QueryErrorBoundary prefix="평점 요약을 ">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<RatingSummarySkeleton />}>
						<RatingSummary />
					</Suspense>
				</HydrationBoundary>
			</QueryErrorBoundary>

			<QueryErrorBoundary prefix="리뷰를 ">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ReviewsSection />
				</HydrationBoundary>
			</QueryErrorBoundary>
		</>
	);
}
