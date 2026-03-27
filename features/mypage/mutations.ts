import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUserProfile, uploadProfileImage } from "./apis";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";

export function useUploadProfileImage() {
	const { handleShowToast } = useToast();
	return useMutation({
		mutationFn: uploadProfileImage,

		onError: () => {
			handleShowToast({
				message: "이미지 업로드에 실패했습니다.\n잠시 후 다시 시도해주세요.",
				status: "error",
			});
		},
	});
}

export function useUserProfileUpdate() {
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
