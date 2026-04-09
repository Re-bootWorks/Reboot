import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
	getMeetingDetail,
	getParticipants,
	getRelatedMeetings,
	getReviews,
} from "@/features/meetupDetail/apis/apis";
import { ParticipantsResponse } from "@/features/meetupDetail/types";
import { useMemo } from "react";

export const meetupDetailQueryKeys = {
	meeting: (meetingId: number) => ["meetupDetail", "meeting", meetingId] as const,
	participants: (meetingId: number) => ["meetupDetail", "participants", meetingId] as const,
	reviews: (meetingId: number, cursor?: string) =>
		["meetupDetail", "reviews", meetingId, cursor] as const,
	related: {
		all: () => ["meetupDetail", "related"] as const,
		detail: (meetingId: number, region: string, type: string) =>
			["meetupDetail", "related", meetingId, region, type] as const,
	},
};

export function useMeetingDetail(meetingId: number) {
	return useSuspenseQuery({
		queryKey: meetupDetailQueryKeys.meeting(meetingId),
		queryFn: () => getMeetingDetail(meetingId),
		staleTime: 1000 * 60 * 5, // 모임 정보: 5분 (자주 안바뀌므로)
	});
}

export function useParticipants(meetingId: number) {
	const response = useSuspenseInfiniteQuery({
		queryKey: meetupDetailQueryKeys.participants(meetingId),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			getParticipants(meetingId, pageParam),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: ParticipantsResponse) => {
			if (!lastPage.hasMore) return undefined;
			return lastPage.nextCursor ?? undefined;
		},
		staleTime: 1000 * 60 * 3,
	});

	const dedupedData = useMemo(() => {
		const flatData = response.data?.pages.flatMap((page) => page.data ?? []) ?? [];

		const seen = new Set<number>();

		return flatData.filter((p) => {
			if (seen.has(p.id)) return false;
			seen.add(p.id);
			return true;
		});
	}, [response.data]);

	return { ...response, data: dedupedData };
}

export function useReviews(meetingId: number, cursor?: string) {
	return useSuspenseQuery({
		queryKey: meetupDetailQueryKeys.reviews(meetingId, cursor),
		queryFn: () => getReviews(meetingId, cursor),
		staleTime: 1000 * 60 * 10, // 리뷰: 10분 (가장 안바뀌므로)
	});
}

export function useRelatedMeetings(meetingId: number, region: string, type: string) {
	return useSuspenseQuery({
		queryKey: meetupDetailQueryKeys.related.detail(meetingId, region, type),
		queryFn: () => getRelatedMeetings(meetingId, region, type),
		staleTime: 1000 * 60 * 5,
	});
}
