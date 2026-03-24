"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Buttons/Button";
import SocialButton from "@/components/ui/Buttons/SocialButton";
import { IcVisibilityOffOutline, IcVisibilityOnOutline } from "@/components/ui/icons";
import InputField from "@/components/ui/Inputs/InputField";
import { useToast } from "@/providers/toast-provider";
import { postLogin } from "@/features/auth/apis";
import { useUserStore } from "@/store/user.store";

const loginSchema = z.object({
	email: z.email("이메일 형식이 아닙니다"),
	password: z.string().min(8, "8자 이상 입력해주세요."),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
	onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const { handleShowToast } = useToast();
	const { setUser } = useUserStore();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onTouched",
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await postLogin({ email: data.email, password: data.password });

			if (!response.ok) {
				if (response.status === 401) {
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
				return;
			}

			const { user } = await response.json();
			setUser(user);

			handleShowToast({ message: "로그인이 완료됐습니다.", status: "success" });
			onSuccess();
		} catch (error) {
			handleShowToast({
				message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
				status: "error",
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-6 md:gap-4">
				<InputField
					label="아이디"
					isRequired={true}
					placeholder="이메일을 입력해주세요"
					{...register("email")}
					hintText={errors.email?.message}
					isDestructive={!!errors.email}
				/>
				<InputField
					type={isPasswordVisible ? "text" : "password"}
					label="비밀번호"
					isRequired={true}
					placeholder="비밀번호를 입력해주세요"
					rightIcon={isPasswordVisible ? <IcVisibilityOnOutline /> : <IcVisibilityOffOutline />}
					onRightIconClick={() => setIsPasswordVisible((prev) => !prev)}
					{...register("password")}
					hintText={errors.password?.message}
					isDestructive={!!errors.password}
				/>
				<div className="pb-2 md:pb-4">
					<Button type="submit" disabled={!isValid}>
						로그인
					</Button>
				</div>
				<div className="flex items-center gap-4">
					<hr className="flex-1 border-gray-300" />
					<span className="text-[15px] leading-normal font-medium text-gray-500">
						SNS 계정으로 로그인
					</span>
					<hr className="flex-1 border-gray-300" />
				</div>
				<div className="flex flex-col gap-3 md:flex-row">
					<SocialButton social="Google">구글로 계속하기</SocialButton>
					<SocialButton social="Kakao">카카오로 계속하기</SocialButton>
				</div>
			</div>
		</form>
	);
}
