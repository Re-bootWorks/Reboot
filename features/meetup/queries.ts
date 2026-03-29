import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getMeetups, postMeetup } from "./apis";
import { MeetupCreateRequest, MeetupListRequest } from "./types";

export const meetupQueryKeys = {
	getMeetups: (params: MeetupListRequest) => ["meetup", params] as const,
	postMeetup: ["meetup", "post"] as const,
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
