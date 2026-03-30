import { useMutation, UseMutationOptions, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getMeetups, postMeetup } from "./apis";
import { MeetupCreateRequest, MeetupItemResponse, MeetupListRequest } from "./types";
import {
	deleteMeetingsFavorite,
	deleteMeetingsJoin,
	postMeetingsFavorite,
	postMeetingsJoin,
	SuccessResponse,
} from "@/apis/meetings";

type MutationCallbacks<TData> = Omit<
	UseMutationOptions<TData, Error, void>,
	"mutationKey" | "mutationFn"
>;

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
	return useSuspenseInfiniteQuery({
		queryKey: meetupQueryKeys.getMeetups(params),
		queryFn: ({ pageParam }) => getMeetups({ ...params, cursor: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: undefined as string | undefined,
		refetchOnWindowFocus: false,
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
export function usePostMeetupFavorite(id: number, options?: MutationCallbacks<MeetupItemResponse>) {
	return useMutation({
		mutationKey: meetupQueryKeys.postMeetingsFavorite,
		mutationFn: () => postMeetingsFavorite({ meetingId: id }),
		...options,
	});
}

/** 모임 찜 해제 */
export function useDeleteMeetupFavorite(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupQueryKeys.deleteMeetingsFavorite,
		mutationFn: () => deleteMeetingsFavorite({ meetingId: id }),
		...options,
	});
}

/** 모임 참여 */
export function usePostMeetupJoin(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupQueryKeys.postMeetingsJoin,
		mutationFn: () => postMeetingsJoin({ meetingId: id }),
		...options,
	});
}

/** 모임 참여 취소 */
export function useDeleteMeetupJoin(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupQueryKeys.deleteMeetingsJoin,
		mutationFn: () => deleteMeetingsJoin({ meetingId: id }),
		...options,
	});
}
