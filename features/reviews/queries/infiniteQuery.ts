"use client";

import { useMemo } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ReviewCardProps, ReviewsListRequest } from "../types";
import { reviewsInfiniteOptions } from "./queryOptions";
import { getReviews } from "../apis/client";

export function useReviewsInfiniteQuery(params: ReviewsListRequest) {
	const response = useSuspenseInfiniteQuery(reviewsInfiniteOptions(params, getReviews));

	const flatData = useMemo(() => {
		const mappedData =
			response.data?.pages.flatMap((page): ReviewCardProps[] =>
				(page.data ?? []).map((review) => ({
					id: review.id,
					meetingId: review.meetingId,
					meetingImage: review.meeting.image,
					score: review.score,
					userImage: review.user.image,
					userName: review.user.name,
					userEmail: review.user.email,
					createdAt: review.createdAt,
					comment: review.comment,
					meetingName: review.meeting.name,
					meetingType: review.meeting.type,
					userId: review.userId,
				})),
			) ?? [];

		const seen = new Set<ReviewCardProps["id"]>();

		return mappedData.filter((item) => {
			if (seen.has(item.id)) return false;
			seen.add(item.id);
			return true;
		});
	}, [response.data]);

	return {
		...response,
		data: flatData,
	};
}
