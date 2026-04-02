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
import { useToast } from "@/providers/toast-provider";
import { mypageQueryKeys } from "./queries";
import { meetupDetailQueryKeys } from "../meetupDetail/queries";

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
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchUsersMe,

		onSuccess: () => {
			handleShowToast({
				message: "프로필이 수정되었습니다.",
				status: "success",
			});
		},

		onError: () => {
			handleShowToast({
				message: "프로필 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

// 주최자 모임 상태 변경
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
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
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
// 주최자 모임 삭제
export function useDeleteMeetings() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetings,

		onSuccess: (_data, variables) => {
			handleShowToast({
				message: "모임이 삭제 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
		},

		onError: () => {
			handleShowToast({
				message: "모임 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

// 참가자 예약 취소
export function useDeleteMeetingsJoin() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetingsJoin,

		onSuccess: (_data, variables) => {
			handleShowToast({
				message: "모임 예약이 취소 되었습니다.",
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting(variables.meetingId),
			});
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.participants(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
		},

		onError: () => {
			handleShowToast({
				message: "모임 예약 취소에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

// 리뷰 작성
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
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 작성에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}

// 리뷰 수정
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
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}

// 리뷰 삭제
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
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}
