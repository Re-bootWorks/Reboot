import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteMeetings,
	deleteMeetingsJoin,
	deleteReviews,
	patchMeetingsStatus,
	patchReviews,
	patchUsersMe,
	postMeetingsReviews,
} from "./apis";
import { useToast } from "@/providers/toast-provider";
import { meetupDetailQueryKeys } from "@/features/shared/queryKeys/meetupDetail";
import { authQueryKeys } from "@/features/shared/queryKeys/auth";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";
import { headerQueryKeys } from "@/features/shared/queryKeys/header";
import { meetupQueryKeys } from "@/features/shared/queryKeys/meetup";
import { reviewsQueryKeys } from "@/features/shared/queryKeys/reviews";
import { uploadImage } from "@/apis/images";
import { getUserErrorMessage } from "@/utils/api";
import { MYPAGE_MESSAGES } from "@/features/mypage/message";

interface UsePatchUsersMeOptions {
	onSuccessBeforeSync?: () => void;
}

export function useUploadProfileImage() {
	const { handleShowToast } = useToast();
	return useMutation({
		mutationFn: uploadImage,

		onSuccess: () => {
			handleShowToast({
				message: MYPAGE_MESSAGES.uploadProfileImageSuccess,
				status: "success",
			});
		},

		onError: (error) => {
			handleShowToast({
				message: getUserErrorMessage(error, MYPAGE_MESSAGES.uploadProfileImageError),
				status: "error",
			});
		},
	});
}

export function usePatchUsersMe(options?: UsePatchUsersMeOptions) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: patchUsersMe,

		onSuccess: () => {
			options?.onSuccessBeforeSync?.();
			handleShowToast({
				message: MYPAGE_MESSAGES.updateProfileSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
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
			handleShowToast({
				message: MYPAGE_MESSAGES.patchMeetingStatusSuccess(variables.status),
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
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
				message: MYPAGE_MESSAGES.deleteMeetingSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
				status: "error",
			});
		},
	});
}

// 참가자 참여 취소
export function useDeleteMeetingsJoin() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: deleteMeetingsJoin,

		onSuccess: (_data, variables) => {
			handleShowToast({
				message: MYPAGE_MESSAGES.deleteMeetingJoinSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(variables.meetingId),
			});
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(variables.meetingId),
			});
			queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
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
				message: MYPAGE_MESSAGES.createReviewSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.reviews.all });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
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
				message: MYPAGE_MESSAGES.updateReviewSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.reviews.all });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
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
				message: MYPAGE_MESSAGES.deleteReviewSuccess,
				status: "success",
			});
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.reviews.all });
		},

		onError: (error) => {
			handleShowToast({
				message: error.message,
				status: "error",
			});
		},
	});
}
