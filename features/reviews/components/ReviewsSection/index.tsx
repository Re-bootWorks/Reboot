"use client";

import { useRef } from "react";
import ReviewCard from "./ReviewCard";
import Empty from "@/components/layout/Empty";
import { ReviewsListRequest } from "../../types";
import { useReviewsInfiniteQuery } from "../../queries/infiniteQuery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/features/mypage/components/Loading";

export default function ReviewsSection(props: ReviewsListRequest) {
	const {
		data: reviews,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useReviewsInfiniteQuery(props);

	const bottomRef = useRef<HTMLDivElement>(null);

	useIntersectionObserver({
		targetRef: bottomRef,
		onIntersect: fetchNextPage,
		isEnabled: hasNextPage && !isFetchingNextPage,
	});

	const hasReviews = reviews.length > 0;

	return (
		<section className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
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
		</section>
	);
}
