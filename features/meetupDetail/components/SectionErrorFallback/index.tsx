"use client";

import { useRouter } from "next/navigation";
import { FallbackProps } from "react-error-boundary";

export default function SectionErrorFallback({ resetErrorBoundary }: FallbackProps) {
	const router = useRouter();

	const handleRetry = () => {
		resetErrorBoundary();
		router.refresh();
	};

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-white py-10">
			<p className="text-sm font-medium text-gray-500">데이터를 불러오지 못했습니다.</p>
			<button
				onClick={handleRetry}
				className="rounded-xl bg-purple-500 px-6 py-2 text-sm text-white">
				다시 시도
			</button>
		</div>
	);
}
