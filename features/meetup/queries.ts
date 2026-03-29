import { useInfiniteQuery, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { getMeetups, postMeetup } from "./apis";
import { MeetupCreateRequest, MeetupItemResponse, MeetupListRequest } from "./types";
import {
	deleteMeetingsFavorite,
	deleteMeetingsJoin,
	postMeetingsFavorite,
	postMeetingsJoin,
} from "@/apis/meetings";

export const meetupQueryKeys = {
	getMeetups: (params: MeetupListRequest) => ["meetup", params] as const,
	postMeetup: ["meetup", "post"] as const,
	postMeetingsFavorite: ["meetings", "favorite", "post"] as const,
	deleteMeetingsFavorite: ["meetings", "favorite", "delete"] as const,
	postMeetingsJoin: ["meetings", "join", "post"] as const,
	deleteMeetingsJoin: ["meetings", "join", "delete"] as const,
};

/** 모임 목록 조회 */
export function useGetMeetups(params: MeetupListRequest) {
	return useInfiniteQuery({
		queryKey: meetupQueryKeys.getMeetups(params),
		queryFn: ({ pageParam }) => getMeetups({ ...params, cursor: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: undefined as string | undefined,
	});
}

/** 모임 생성 */
export function usePostMeetup(data: MeetupCreateRequest) {
	return useMutation({
		mutationKey: meetupQueryKeys.postMeetup,
		mutationFn: () => postMeetup(data),
	});
}

/** 모임 찜 추가 */
export function usePostMeetingsFavorite(
	...options: UseMutationOptions<MeetupItemResponse, Error, number>[]
) {
	return useMutation({
		mutationKey: meetupQueryKeys.postMeetingsFavorite,
		mutationFn: (meetingId: number) => postMeetingsFavorite({ meetingId }),
		...options,
	});
}

/** 모임 찜 해제 */
export function useDeleteMeetingsFavorite(
	...options: UseMutationOptions<MeetupItemResponse, Error, number>[]
) {
	return useMutation({
		mutationKey: meetupQueryKeys.deleteMeetingsFavorite,
		mutationFn: (meetingId: number) => deleteMeetingsFavorite({ meetingId }),
		...options,
	});
}

/** 모임 참여 */
export function usePostMeetingsJoin(
	...options: UseMutationOptions<MeetupItemResponse, Error, number>[]
) {
	return useMutation({
		mutationKey: meetupQueryKeys.postMeetingsJoin,
		mutationFn: (meetingId: number) => postMeetingsJoin({ meetingId }),
		...options,
	});
}

/** 모임 참여 취소 */
export function useDeleteMeetingsJoin(
	...options: UseMutationOptions<MeetupItemResponse, Error, number>[]
) {
	return useMutation({
		mutationKey: meetupQueryKeys.deleteMeetingsJoin,
		mutationFn: (meetingId: number) => deleteMeetingsJoin({ meetingId }),
		...options,
	});
}
