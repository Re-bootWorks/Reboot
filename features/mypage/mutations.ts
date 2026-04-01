import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteMeetings,
	deleteMeetingsJoin,
	deleteReviews,
	patchMeetingsStatus,
	patchReviews,
	patchUsersMe,
	postMeetingsReviews,
	uploadProfileImage,
} from "./apis";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";
import { mypageQueryKeys } from "./queries";

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

export function usePatchUsersMe() {
	const queryClient = useQueryClient();
	const setUser = useUserStore((state) => state.setUser);
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchUsersMe,

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

export function usePatchMeetingsStatus() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchMeetingsStatus,

		onSuccess: (_data, variables) => {
			const isConfirmed = variables.status === "CONFIRMED";

			handleShowToast({
				message: `모임이 ${isConfirmed ? "확정" : "취소"}되었습니다.`,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created });
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

export function useDeleteMeetings() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetings,

		onSuccess: () => {
			handleShowToast({
				message: "모임이 삭제 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created });
		},

		onError: () => {
			handleShowToast({
				message: "모임 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useDeleteMeetingsJoin() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetingsJoin,

		onSuccess: () => {
			handleShowToast({
				message: "모임 예약이 취소 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created });
		},

		onError: () => {
			handleShowToast({
				message: "모임 예약 취소에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function usePostMeetingsReviews() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: postMeetingsReviews,

		onSuccess: () => {
			handleShowToast({
				message: `리뷰가 작성 되었습니다.`,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.reviews });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 작성에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}

export function usePatchReviews() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchReviews,

		onSuccess: () => {
			handleShowToast({
				message: `리뷰가 수정 되었습니다.`,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.reviews });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}

export function useDeleteReviews() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteReviews,

		onSuccess: () => {
			handleShowToast({
				message: `리뷰가 삭제 되었습니다.`,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.reviews });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}
