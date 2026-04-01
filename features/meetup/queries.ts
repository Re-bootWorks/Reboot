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
import { uploadImage } from "@/apis/images";
import { useUserStore } from "@/store/user.store";

type MutationCallbacks<TData, TVariables = void> = Omit<
	UseMutationOptions<TData, Error, TVariables>,
	"mutationKey" | "mutationFn"
>;

export const meetupQueryKeys = {
	list: ["meetup", "list"] as const,
	listWithParams: (params: MeetupListRequest, userId: number | null) =>
		[...meetupQueryKeys.list, params, userId] as const,
};

export const meetupMutationKeys = {
	postMeetup: ["meetup", "post"] as const,
	uploadImage: ["meetup", "image", "upload"] as const,
	postFavorite: ["meetings", "favorite", "post"] as const,
	deleteFavorite: ["meetings", "favorite", "delete"] as const,
	postJoin: ["meetings", "join", "post"] as const,
	deleteJoin: ["meetings", "join", "delete"] as const,
};

/** 모임 목록 조회 */
export function useGetMeetups(params: MeetupListRequest) {
	const userId = useUserStore((state) => state.user?.id ?? null);
	// 유저(미인증 포함)가 변경되면 refetch
	return useSuspenseInfiniteQuery({
		queryKey: meetupQueryKeys.listWithParams(params, userId),
		queryFn: ({ pageParam }) => getMeetups({ ...params, cursor: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: undefined as string | undefined,
		refetchOnWindowFocus: false,
		staleTime: 0,
		gcTime: 5 * 60 * 1000, // 5분
	});
}

/** 모임 생성 */
export function usePostMeetup(
	options?: MutationCallbacks<MeetupItemResponse, MeetupCreateRequest>,
) {
	return useMutation({
		mutationKey: meetupMutationKeys.postMeetup,
		mutationFn: (data: MeetupCreateRequest) => postMeetup(data),
		...options,
	});
}

/** 모임 이미지 업로드 */
export function useUploadMeetupImage() {
	return useMutation({
		mutationKey: meetupMutationKeys.uploadImage,
		mutationFn: (file: File) => uploadImage(file),
	});
}

/** 모임 찜 추가 */
export function usePostMeetupFavorite(id: number, options?: MutationCallbacks<MeetupItemResponse>) {
	return useMutation({
		mutationKey: meetupMutationKeys.postFavorite,
		mutationFn: () => postMeetingsFavorite({ meetingId: id }),
		...options,
	});
}

/** 모임 찜 해제 */
export function useDeleteMeetupFavorite(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupMutationKeys.deleteFavorite,
		mutationFn: () => deleteMeetingsFavorite({ meetingId: id }),
		...options,
	});
}

/** 모임 참여 */
export function usePostMeetupJoin(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupMutationKeys.postJoin,
		mutationFn: () => postMeetingsJoin({ meetingId: id }),
		...options,
	});
}

/** 모임 참여 취소 */
export function useDeleteMeetupJoin(id: number, options?: MutationCallbacks<SuccessResponse>) {
	return useMutation({
		mutationKey: meetupMutationKeys.deleteJoin,
		mutationFn: () => deleteMeetingsJoin({ meetingId: id }),
		...options,
	});
}
