import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import {
	deleteMeetingsFavorite,
	deleteMeetingsJoin,
	postMeetingsFavorite,
	postMeetingsJoin,
} from "@/apis/meetings";
import { MeetupListRequest } from "../meetup/types";

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

const FAVORITES_QUERY_BASE_KEY = ["favorites"] as const;

async function invalidateMeetupAndFavoritesQueries(queryClient: ReturnType<typeof useQueryClient>) {
	await Promise.all([
		queryClient.invalidateQueries({
			queryKey: FAVORITES_QUERY_BASE_KEY,
		}),
		queryClient.invalidateQueries({
			queryKey: meetupQueryKeys.list,
		}),
	]);
}

/** 모임 찜 추가 */
export function usePostMeetupFavorite(id: number, options?: MutationCallbacks<void>) {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationKey: meetupMutationKeys.postFavorite,
		mutationFn: () => postMeetingsFavorite({ meetingId: id }),
		...restOptions,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateMeetupAndFavoritesQueries(queryClient);
			await onSuccess?.(data, variables, onMutateResult, context);
		},
	});
}

/** 모임 찜 해제 */
export function useDeleteMeetupFavorite(id: number, options?: MutationCallbacks<void>) {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationKey: meetupMutationKeys.deleteFavorite,
		mutationFn: () => deleteMeetingsFavorite({ meetingId: id }),
		...restOptions,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateMeetupAndFavoritesQueries(queryClient);
			await onSuccess?.(data, variables, onMutateResult, context);
		},
	});
}

/** 모임 참여 */
export function usePostMeetupJoin(id: number, options?: MutationCallbacks<void>) {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationKey: meetupMutationKeys.postJoin,
		mutationFn: () => postMeetingsJoin({ meetingId: id }),
		...restOptions,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateMeetupAndFavoritesQueries(queryClient);
			await onSuccess?.(data, variables, onMutateResult, context);
		},
	});
}

/** 모임 참여 취소 */
export function useDeleteMeetupJoin(id: number, options?: MutationCallbacks<void>) {
	const queryClient = useQueryClient();
	const { onSuccess, ...restOptions } = options ?? {};

	return useMutation({
		mutationKey: meetupMutationKeys.deleteJoin,
		mutationFn: () => deleteMeetingsJoin({ meetingId: id }),
		...restOptions,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateMeetupAndFavoritesQueries(queryClient);
			await onSuccess?.(data, variables, onMutateResult, context);
		},
	});
}
