"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginModal/LoginForm";

export default function LoginPage() {
	const router = useRouter();

	return (
		<div>
			<div className="w-[343px] rounded-3xl bg-white p-6 shadow-xl md:w-142 md:px-14 md:pt-12 md:pb-11">
				<h2 className="mb-8 text-center text-2xl font-semibold text-gray-900 md:mb-12">로그인</h2>
				<LoginForm onSuccess={() => router.push("/")} />
				<p className="mt-8 text-center text-sm font-medium text-gray-800">
					같이달램이 처음이신가요?{" "}
					<Link href="/signup" className="font-semibold text-purple-600 underline">
						회원가입
					</Link>
				</p>
			</div>
		</div>
	);
}
