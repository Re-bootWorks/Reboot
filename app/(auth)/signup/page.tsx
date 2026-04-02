"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignUpForm } from "@/features/auth/components/SignUpModal/SignUpForm";
import AuthFormContainer from "@/features/auth/components/AuthFormContainer";

export default function SignUpPage() {
	const router = useRouter();

	return (
		<AuthFormContainer
			title="회원가입"
			footer={
				<>
					이미 회원이신가요?{" "}
					<Link href="/login" className="font-semibold text-purple-600 underline">
						로그인
					</Link>
				</>
			}>
			<SignUpForm
				onSuccess={() => router.push("/meetup/list")}
				onAutoLoginFail={() => router.replace("/login")}
			/>
		</AuthFormContainer>
	);
}
