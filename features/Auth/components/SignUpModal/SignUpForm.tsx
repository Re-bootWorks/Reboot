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
import { postSignUp } from "@/features/auth/apis";

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
	const { handleShowToast } = useToast();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: SignUpFormData) => {
		try {
			const response = await postSignUp({
				email: data.email,
				password: data.password,
				name: data.name,
			});

			if (response.status === 409) {
				setError("email", { message: "이미 사용 중인 아이디입니다." });
				handleShowToast({ message: "이미 사용 중인 아이디입니다.", status: "error" });
				return;
			}

			if (!response.ok) {
				handleShowToast({
					message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
					status: "error",
				});
				return;
			}

			handleShowToast({ message: "회원가입이 완료됐습니다.", status: "success" });
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
					<Button type="submit" disabled={!isValid}>
						회원가입
					</Button>
				</div>
				<div className="flex items-center gap-4">
					<hr className="flex-1 border-gray-300" />
					<span className="text-[15px] font-medium text-gray-500">SNS 계정으로 회원가입</span>
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
