"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Buttons/Button";
import SocialButton from "@/components/ui/Buttons/SocialButton";
import { IcVisibilityOffOutline, IcVisibilityOnOutline } from "@/components/ui/icons";
import InputField from "@/components/ui/Inputs/InputField";
import { useSignUp } from "@/features/auth/mutations";
import { KAKAO_LOGIN_URL, GOOGLE_LOGIN_URL } from "@/constants/auth";

const signUpSchema = z
	.object({
		name: z.string().min(1, "이름은 필수 입력 항목입니다."),
		email: z.email("이메일 형식이 아닙니다."),
		password: z.string().min(8, "8자 이상 입력해주세요."),
		passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해주세요"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "비밀번호가 일치하지 않습니다.",
		path: ["passwordConfirm"],
	});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
	onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
	const { mutate: signUp, isPending } = useSignUp(onSuccess);
	const [isSocialPending, setIsSocialPending] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		mode: "onTouched",
	});

	const onSubmit = (data: SignUpFormData) => {
		signUp({ email: data.email, password: data.password, name: data.name });
	};

	function handleKakaoLogin() {
		setIsSocialPending(true);
		window.location.href = KAKAO_LOGIN_URL;
	}
	function handleGoogleLogin() {
		setIsSocialPending(true);
		window.location.href = GOOGLE_LOGIN_URL;
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-6 md:gap-4">
				<InputField
					label="이름"
					isRequired={true}
					placeholder="이름을 입력해주세요"
					{...register("name")}
					hintText={errors.name?.message}
					isDestructive={!!errors.name}
				/>
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
				<InputField
					type={isPasswordConfirmVisible ? "text" : "password"}
					label="비밀번호 확인"
					isRequired={true}
					placeholder="비밀번호를 한 번 더 입력해주세요"
					rightIcon={
						isPasswordConfirmVisible ? <IcVisibilityOnOutline /> : <IcVisibilityOffOutline />
					}
					onRightIconClick={() => setIsPasswordConfirmVisible((prev) => !prev)}
					{...register("passwordConfirm")}
					hintText={errors.passwordConfirm?.message}
					isDestructive={!!errors.passwordConfirm}
				/>
				<div className="pb-2 md:pb-4">
					<Button type="submit" disabled={!isValid || isSocialPending} isPending={isPending}>
						회원가입
					</Button>
				</div>
				<div className="flex items-center gap-4">
					<hr className="flex-1 border-gray-300" />
					<span className="text-[15px] font-medium text-gray-500">SNS 계정으로 회원가입</span>
					<hr className="flex-1 border-gray-300" />
				</div>
				<div className="flex flex-col gap-3 md:flex-row">
					<SocialButton
						social="Google"
						onClick={handleGoogleLogin}
						disabled={isSocialPending || isPending}>
						구글로 계속하기
					</SocialButton>
					<SocialButton
						social="Kakao"
						onClick={handleKakaoLogin}
						disabled={isSocialPending || isPending}>
						카카오로 계속하기
					</SocialButton>
				</div>
			</div>
		</form>
	);
}
