import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteNotifications,
	deleteNotificationsAll,
	putNotificationsRead,
	putNotificationsReadAll,
} from "./apis";
import { useToast } from "@/providers/toast-provider";
import { headerQueryKeys } from "./queries";
import { CursorPageResponse, NotificationCardList } from "./types";

const notificationQueryKey = headerQueryKeys.notification.all;

export function usePutNotificationsReadAll() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: putNotificationsReadAll,

		onSuccess: () => {
			handleShowToast({
				message: "모든 알림을 읽었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: notificationQueryKey });
		},

		onError: () => {
			handleShowToast({
				message: "모든 알림 읽기에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function usePutNotificationsRead() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: putNotificationsRead,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationQueryKey });
		},

		onError: () => {
			handleShowToast({
				message: "알림 읽기에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useDeleteNotificationsAll() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteNotificationsAll,

		onSuccess: () => {
			handleShowToast({
				message: "전체 알림이 삭제되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: notificationQueryKey });
		},

		onError: () => {
			handleShowToast({
				message: "전체 알림 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useDeleteNotifications() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: ({ notificationId }: { notificationId: number }) =>
			deleteNotifications({ notificationId }),

		onMutate: async ({ notificationId }) => {
			// 진행중인 refetch 취소
			await queryClient.cancelQueries({ queryKey: notificationQueryKey });
			// 실패시 롤백용으로 현재 캐시 저장
			const prevData =
				queryClient.getQueryData<InfiniteData<CursorPageResponse<NotificationCardList>>>(
					notificationQueryKey,
				);

			// 캐시에서 해당 알림 제거
			if (prevData) {
				queryClient.setQueryData<InfiniteData<CursorPageResponse<NotificationCardList>>>(
					notificationQueryKey,
					{
						...prevData,
						pages: prevData.pages.map((page) => ({
							...page,
							data: page.data.filter((item) => item.id !== notificationId), // 해당 id 제거
						})),
					},
				);
			}
			return { prevData };
		},

		onSuccess: () => {
			handleShowToast({
				message: "알림이 삭제되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: notificationQueryKey });
		},

		onError: (_error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(notificationQueryKey, context.prevData);
			}
			handleShowToast({
				message: "알림 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}
