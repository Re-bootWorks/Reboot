"use client";

import ErrorPage from "@/components/common/ErrorPage";

export default function MyPageError({ reset }: { reset: () => void }) {
	return <ErrorPage onRetryAction={reset} prefix="마이페이지를 " />;
}
