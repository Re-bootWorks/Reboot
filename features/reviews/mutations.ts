import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import { reviewsQueryKeys } from "../reviews/queries/queryKeys";
import { deleteReviews, patchReviews } from "./apis/client";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";

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
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.reviews.all });
			queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.reviews.all });
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
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.reviews.all });
		},

		onError: () => {
			handleShowToast({
				message: `리뷰 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.`,
				status: "error",
			});
		},
	});
}
