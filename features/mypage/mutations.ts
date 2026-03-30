import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteMeeting,
	deleteMeetingJoin,
	patchMeetingStatus,
	patchUserProfile,
	uploadProfileImage,
} from "./apis";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";

export function useUploadProfileImage() {
	const { handleShowToast } = useToast();
	return useMutation({
		mutationFn: uploadProfileImage,

		onSuccess: () => {
			handleShowToast({
				message: "이미지가 업로드되었습니다.",
				status: "success",
			});
		},

		onError: () => {
			handleShowToast({
				message: "이미지 업로드에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function usePatchUserProfile() {
	const queryClient = useQueryClient();
	const setUser = useUserStore((state) => state.setUser);
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchUserProfile,

		onSuccess: (updatedUser) => {
			setUser(updatedUser);
			handleShowToast({
				message: "프로필이 수정되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},

		onError: () => {
			handleShowToast({
				message: "프로필 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function usePatchMeetingStatus() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchMeetingStatus,

		onSuccess: (_data, variables) => {
			const isConfirmed = variables.status === "CONFIRMED";

			handleShowToast({
				message: `모임이 ${isConfirmed ? "확정" : "취소"}되었습니다.`,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
		},

		onError: (_error, variables) => {
			const isConfirmed = variables.status === "CONFIRMED";

			handleShowToast({
				message: `모임 ${isConfirmed ? "확정" : "취소"}에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}

export function useDeleteMeeting() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeeting,

		onSuccess: () => {
			handleShowToast({
				message: "모임이 삭제 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
		},

		onError: () => {
			handleShowToast({
				message: "모임 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useDeleteMeetingJoin() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetingJoin,

		onSuccess: () => {
			handleShowToast({
				message: "모임 예약이 취소 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
		},

		onError: () => {
			handleShowToast({
				message: "모임 예약 취소에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}
