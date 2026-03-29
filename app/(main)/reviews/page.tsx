// app/.../page.tsx
import { Suspense } from "react";
import PageIntro from "@/components/ui/PageIntro";
import ListControls from "@/features/reviews/components/ListControls";
import RatingSummary from "@/features/reviews/components/RatingSummary";
import ReviewsSection from "@/features/reviews/components/ReviewsSection";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ReviewsListRequest, ReviewsSortBy, ReviewsSortOrder } from "@/features/reviews/types";
import {
	prefetchReviewsStatistics,
	prefetchReviews,
} from "@/features/reviews/queries/prefetchQueries";
import SectionErrorBoundary from "@/features/reviews/components/ErrorBoundary";

function isReviewsSortBy(value: string | undefined): value is ReviewsSortBy {
	return value === "dateTime" || value === "registrationEnd" || value === "participantCount";
}

function isReviewsSortOrder(value: string | undefined): value is ReviewsSortOrder {
	return value === "asc" || value === "desc";
}

type Props = {
	searchParams: Promise<ReviewsListRequest>;
};

export default async function ReviewsPage({ searchParams }: Props) {
	const params = await searchParams;
	const queryClient = new QueryClient();

	const normalizedParams: ReviewsListRequest = {
		type: params.type,
		region: params.region,
		date: params.date,
		sortBy: isReviewsSortBy(params.sortBy) ? params.sortBy : undefined,
		sortOrder: isReviewsSortOrder(params.sortOrder) ? params.sortOrder : undefined,
		size: params.size,
	};

	await prefetchReviewsStatistics(queryClient);
	await prefetchReviews(queryClient, normalizedParams);

	return (
		<>
			<header className="mt-8.5 mb-8 md:mt-10 md:mb-14 lg:mt-[3.188rem]">
				<PageIntro />
			</header>

			{/* ListFilters 수정중 */}
			<Suspense fallback={<></>}>
				<ListControls />
			</Suspense>

			<SectionErrorBoundary fallback={<div>에러 바운더리 css 추후 작업</div>}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<div>스켈레톤 작업 예정</div>}>
						<RatingSummary type={params.type} />
					</Suspense>
				</HydrationBoundary>
			</SectionErrorBoundary>

			<SectionErrorBoundary fallback={<div>에러 바운더리 css 추후 작업</div>}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<div>스켈레톤 작업 예정</div>}>
						<ReviewsSection {...normalizedParams} />
					</Suspense>
				</HydrationBoundary>
			</SectionErrorBoundary>
		</>
	);
}
