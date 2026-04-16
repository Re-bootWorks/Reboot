import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogin, postSignUp, postLogout, postOAuthLogin } from "@/features/auth/apis";
import { useToast } from "@/providers/toast-provider";
import { useRouter } from "next/navigation";
import { authQueryKeys } from "../shared/queryKeys/auth";

export function useLogin(onSuccess: () => void) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();
	const router = useRouter();

	return useMutation({
		mutationFn: postLogin,
		onSuccess: (data) => {
			queryClient.setQueryData(authQueryKeys.me, data.user);
			handleShowToast({ message: "로그인이 완료됐습니다.", status: "success" });
			onSuccess();
			router.refresh();
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

export function useSignUp(onSuccess: () => void, onAutoLoginFail?: () => void) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: postSignUp,
		onSuccess: async (_, variables) => {
			try {
				const loginResult = await postLogin({
					email: variables.email,
					password: variables.password,
				});
				queryClient.setQueryData(authQueryKeys.me, loginResult.user);

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
	const { handleShowToast } = useToast();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: postLogout,
		onSuccess: () => {
			handleShowToast({ message: "로그아웃 됐습니다.", status: "success" });
		},
		onError: () => {
			handleShowToast({ message: "오류가 발생했습니다.", status: "error" });
		},
		onSettled: () => {
			queryClient.clear();
			router.refresh();
		},
	});
}

export function useOAuthLogin(onSuccess: () => void) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();
	const router = useRouter();

	return useMutation({
		mutationFn: ({ provider, token }: { provider: "google" | "kakao"; token: string }) =>
			postOAuthLogin(provider, token),
		onSuccess: (data) => {
			queryClient.setQueryData(authQueryKeys.me, data.user);
			handleShowToast({ message: "로그인이 완료됐습니다.", status: "success" });
			onSuccess();
			router.refresh();
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}
