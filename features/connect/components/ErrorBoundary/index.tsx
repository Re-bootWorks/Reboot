"use client";

import type { FallbackProps } from "react-error-boundary";
import { useRouter } from "next/navigation";

export default function ConnectErrorFallback({ resetErrorBoundary }: FallbackProps) {
	const router = useRouter();

	return (
		<div className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-white py-10 text-center">
			<p className="text-base font-semibold text-gray-900">게시글을 불러오지 못했어요</p>
			<p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => router.push("/connect")}
					className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700">
					목록으로
				</button>
				<button
					type="button"
					onClick={resetErrorBoundary}
					className="rounded-xl bg-purple-500 px-4 py-2 text-sm text-white">
					다시 시도
				</button>
			</div>
		</div>
	);
}
