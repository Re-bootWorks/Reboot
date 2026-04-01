"use client";

import type { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했어요.";

	return (
		<div className="flex min-h-40 w-full flex-col items-center justify-center rounded-3xl bg-white px-6 py-8 text-center md:rounded-4xl">
			<p className="text-base font-semibold">문제가 발생했어요.</p>
			<p className="mt-2 text-sm text-gray-600">잠시 후 다시 시도해주세요.</p>

			{process.env.NODE_ENV === "development" && (
				<pre className="mt-4 w-full overflow-x-auto rounded-xl bg-gray-100 p-3 text-left text-xs text-red-500">
					{errorMessage}
				</pre>
			)}

			<button
				type="button"
				onClick={resetErrorBoundary}
				className="mt-4 cursor-pointer rounded-xl bg-black px-4 py-2 text-sm text-white">
				다시 시도
			</button>
		</div>
	);
}
