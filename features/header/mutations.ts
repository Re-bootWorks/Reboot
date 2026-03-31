import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteNotifications,
	deleteNotificationsAll,
	putNotificationsRead,
	putNotificationsReadAll,
} from "./apis";
import { useToast } from "@/providers/toast-provider";
import { headerQueryKeys } from "./queries";

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
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications });
		},

		onError: () => {
			handleShowToast({
				message: "전체 알림 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function usePutNotificationsReadAll() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: putNotificationsReadAll,

		onSuccess: () => {
			handleShowToast({
				message: "모든 알림을 읽음 처리했습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications });
		},

		onError: () => {
			handleShowToast({
				message: "전체 알림 읽음 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.",
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
			handleShowToast({
				message: "알림을 읽음 처리했습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications });
		},

		onError: () => {
			handleShowToast({
				message: "알림 읽음 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useDeleteNotifications() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteNotifications,

		onSuccess: () => {
			handleShowToast({
				message: "알림이 삭제되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications });
		},

		onError: () => {
			handleShowToast({
				message: "알림 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}
