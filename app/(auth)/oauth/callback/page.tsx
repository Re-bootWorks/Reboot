"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postSocialLogin } from "@/features/auth/apis";

function OAuthCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get("accessToken");
		const refreshToken = searchParams.get("refreshToken");
		const error = searchParams.get("error");

		if (error || !accessToken || !refreshToken) {
			router.replace("/login");
			return;
		}

		const handleCallback = async () => {
			try {
				await postSocialLogin({ accessToken, refreshToken });
				window.location.href = "/";
			} catch {
				router.replace("/login");
			}
		};

		handleCallback();
	}, [router, searchParams]);
	return <div>로그인 처리 중...</div>;
}

export default function OAuthCallbackPage() {
	return (
		<Suspense fallback={<div>로그인 처리 중...</div>}>
			<OAuthCallbackContent />
		</Suspense>
	);
}
