import { useSuspenseQuery } from "@tanstack/react-query";
import {
	getMeetingDetail,
	getParticipants,
	getRelatedMeetings,
	getReviews,
} from "@/features/meetupDetail/apis/apis";

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
	return useSuspenseQuery({
		queryKey: meetupDetailQueryKeys.participants(meetingId),
		queryFn: () => getParticipants(meetingId),
		staleTime: 1000 * 60 * 3, // 참여자: 3분 (실시간성 필요하므로)
	});
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
