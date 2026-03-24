import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { postLogout } from "@/features/auth/apis";
import { useToast } from "@/providers/toast-provider";

export function useLogout() {
	const { clearUser } = useUserStore();
	const { handleShowToast } = useToast();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postLogout,
		onSuccess: () => {
			clearUser();
			queryClient.removeQueries({ queryKey: ["me"] });
			handleShowToast({ message: "로그아웃 됐습니다.", status: "success" });
		},
		onError: () => {
			handleShowToast({ message: "로그아웃에 실패했습니다.", status: "error" });
		},
	});
}
