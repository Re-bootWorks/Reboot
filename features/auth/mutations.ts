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
		onError: (error: Error & { status?: number }) => {
			if (error.status === 401) {
				handleShowToast({
					message: "이메일 또는 비밀번호가 올바르지 않습니다.",
					status: "error",
				});
			} else {
				handleShowToast({
					message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
					status: "error",
				});
			}
		},
	});
}

export function useSignUp(onSuccess: () => void) {
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
			} catch {}
			handleShowToast({ message: "회원가입이 완료됐습니다.", status: "success" });
			onSuccess();
		},
		onError: (error: Error & { status?: number }) => {
			if (error.status === 409) {
				handleShowToast({ message: "이미 사용 중인 아이디입니다.", status: "error" });
			} else {
				handleShowToast({
					message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
					status: "error",
				});
			}
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
