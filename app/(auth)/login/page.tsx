"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginModal/LoginForm";
import AuthFormContainer from "@/features/auth/components/AuthFormContainer";

export default function LoginPage() {
	const router = useRouter();

	return (
		<AuthFormContainer
			title="로그인"
			footer={
				<>
					리부트가 처음이신가요?{" "}
					<Link href="/signup" className="font-semibold text-purple-600 underline">
						회원가입
					</Link>
				</>
			}>
			<LoginForm onSuccess={() => router.push("/")} />
		</AuthFormContainer>
	);
}
