import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { postLogin, postSignUp, postLogout } from "@/features/auth/apis";
import { useToast } from "@/providers/toast-provider";

export function useLogin(onSuccess: () => void) {
	const { setUser } = useUserStore();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: postLogin,
		onSuccess: (data) => {
			setUser(data.user);
			handleShowToast({ message: "로그인이 완료됐습니다.", status: "success" });
			onSuccess();
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

export function useSignUp(onSuccess: () => void, onAutoLoginFail?: () => void) {
	const { setUser } = useUserStore();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: postSignUp,
		onSuccess: async (_, variables) => {
			try {
				const loginResult = await postLogin({
					email: variables.email,
					password: variables.password,
				});
				setUser(loginResult.user);

				handleShowToast({ message: "회원가입이 완료됐습니다.", status: "success" });
				onSuccess();
			} catch {
				handleShowToast({
					message: "회원가입이 완료됐습니다. 로그인 해주세요.",
					status: "success",
				});
				onAutoLoginFail?.();
			}
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

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
