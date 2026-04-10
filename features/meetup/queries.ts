import {
	keepPreviousData,
	useInfiniteQuery,
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";
import type { MeetupCreateRequest, MeetupItemResponse, MeetupListRequest } from "./types";
import { getMeetups, postMeetup } from "./apis";
import {
	deleteMeetingsFavorite,
	deleteMeetingsJoin,
	postMeetingsFavorite,
	postMeetingsJoin,
	SuccessResponse,
} from "@/apis/meetings";
import { uploadImage } from "@/apis/images";
import { useUserStore } from "@/store/user.store";
import {
	transformDateEndQuery,
	transformDateStartQuery,
	transformKeywordQuery,
	transformQueryValue,
	transformSortByQuery,
	transformSortOrderQuery,
	transformTypeValue,
} from "./list/utils";
import { QUERY_KEYS } from "./list/constants";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useEffect } from "react";

type MutationCallbacks<TData, TVariables = void> = Omit<
	UseMutationOptions<TData, Error, TVariables>,
	"mutationKey" | "mutationFn"
>;

export const meetupQueryKeys = {
	list: ["meetup", "list"] as const,
	listWithParams: (params: MeetupListRequest) => [...meetupQueryKeys.list, params] as const,
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
export function useGetMeetups(size: number) {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const { get } = useQueryParams();
	const params = {
		type: transformTypeValue(get(QUERY_KEYS.TYPE)),
		keyword: transformKeywordQuery(get(QUERY_KEYS.KEYWORD)),
		region: transformQueryValue(get(QUERY_KEYS.REGION)),
		dateStart: transformDateStartQuery(get(QUERY_KEYS.DATE_START)),
		dateEnd: transformDateEndQuery(get(QUERY_KEYS.DATE_END)),
		sortBy: transformSortByQuery(get(QUERY_KEYS.SORT_BY)),
		sortOrder: transformSortOrderQuery(get(QUERY_KEYS.SORT_ORDER)),
		size,
	};

	useEffect(() => {
		queryClient.invalidateQueries({
			queryKey: meetupQueryKeys.listWithParams(params),
		});
	}, [user?.id]);

	// [FIX] useSuspenseInfiniteQuery + Suspense 사용 시 AnimatePresence 에서 렌더링 이슈 발생
	return useInfiniteQuery({
		queryKey: meetupQueryKeys.listWithParams(params),
		queryFn: ({ pageParam }) => getMeetups({ ...params, cursor: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: undefined as string | undefined,
		placeholderData: keepPreviousData,
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
