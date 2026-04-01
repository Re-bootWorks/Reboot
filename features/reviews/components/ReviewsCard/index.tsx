"use client";

import { Suspense, useRef } from "react";
import ReviewCard from "./ReviewCard";
import Empty from "@/components/layout/Empty";
import { ReviewsListRequest } from "../../types";
import { toDateTimeRangeEnd, toDateTimeRangeStart } from "../../utils";
import { useReviewsInfiniteQuery } from "../../queries/infiniteQuery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import { useSearchParams } from "next/navigation";
import ReviewsSectionSkeleton from "./reviewsSkeleton";

export default function ReviewsCard() {
	return (
		<section className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
			<Suspense fallback={<ReviewsSectionSkeleton />}>
				<ReviewsCardContent />
			</Suspense>
		</section>
	);
}

function ReviewsCardContent() {
	const searchParams = useSearchParams();

	const params: ReviewsListRequest = {
		type: searchParams.get("type") ?? undefined,
		region: searchParams.get("region") ?? undefined,
		dateStart: toDateTimeRangeStart(searchParams.get("dateStart")),
		dateEnd: toDateTimeRangeEnd(searchParams.get("dateEnd")),
		sortBy: (searchParams.get("sortBy") as ReviewsListRequest["sortBy"]) ?? undefined,
		sortOrder: (searchParams.get("sortOrder") as ReviewsListRequest["sortOrder"]) ?? undefined,
		size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
	};

	const {
		data: reviews,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useReviewsInfiniteQuery(params);

	const bottomRef = useRef<HTMLDivElement>(null);

	useIntersectionObserver({
		targetRef: bottomRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	const hasReviews = reviews.length > 0;

	return (
		<>
			{hasReviews ? (
				<div className="flex flex-col gap-4 md:gap-8">
					{reviews.map((review) => (
						<ReviewCard key={review.id} {...review} />
					))}
				</div>
			) : (
				<Empty>아직 리뷰가 없어요</Empty>
			)}
			<div ref={bottomRef} />
			{isFetchingNextPage && <Loading />}
		</>
	);
}
