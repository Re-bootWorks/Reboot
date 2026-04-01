"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ReviewCardProps, ReviewsListRequest } from "../types";
import { reviewsInfiniteOptions } from "./queryOptions";
import { getReviews } from "../apis/client";

export function useReviewsInfiniteQuery(params: ReviewsListRequest) {
	const response = useSuspenseInfiniteQuery(reviewsInfiniteOptions(params, getReviews));

	const flatData =
		response.data?.pages.flatMap((page): ReviewCardProps[] =>
			(page.data ?? []).map((review) => ({
				id: review.id,
				meetingId: review.meetingId,
				meetingImage: review.meeting.image,
				score: review.score,
				userImage: review.user.image,
				userName: review.user.name,
				createdAt: review.createdAt,
				comment: review.comment,
				meetingName: review.meeting.name,
				meetingType: review.meeting.type,
				userId: review.userId,
			})),
		) ?? [];

	const dedupedData = (() => {
		const seen = new Set<number>();
		const result: ReviewCardProps[] = [];

		for (const item of flatData) {
			if (seen.has(item.id)) continue;
			seen.add(item.id);
			result.push(item);
		}

		return result;
	})();

	return {
		...response,
		data: dedupedData,
	};
}
