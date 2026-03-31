import { Suspense } from "react";
import PageIntro from "@/components/ui/PageIntro";
import ListControls from "@/features/reviews/components/ListControls";
import RatingSummary from "@/features/reviews/components/RatingSummary";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ReviewsListRequest } from "@/features/reviews/types";
import {
	prefetchReviewsStatistics,
	prefetchReviews,
	prefetchReviewsCategoriesStatistics,
} from "@/features/reviews/queries/prefetchQueries";
import { ErrorBoundary } from "react-error-boundary";
import RatingSummarySkeleton from "@/features/reviews/components/RatingSummary/RatingSummarySkeleton";
import ReviewsSection from "@/features/reviews/components/ReviewsCard/ReviewsSectionWrapper/ReviewsSection";
import ErrorFallback from "@/features/reviews/components/ErrorBoundary";

type Props = {
	searchParams: Promise<ReviewsListRequest>;
};

export default async function ReviewsPage({ searchParams }: Props) {
	const params = await searchParams;

	const queryClient = new QueryClient();

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

			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<RatingSummarySkeleton />}>
						<RatingSummary />
					</Suspense>
				</HydrationBoundary>
			</ErrorBoundary>

			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ReviewsSection />
				</HydrationBoundary>
			</ErrorBoundary>
		</>
	);
}
