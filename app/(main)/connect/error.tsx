"use client";

// Next.js App Router의 라우트 레벨 에러 핸들러
// ErrorBoundary로 잡지 못한 예상치 못한 에러의 마지막 안전망
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	console.error(error);
	const router = useRouter();

	return (
		<div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-center">
			<p className="text-base font-semibold text-gray-900">문제가 발생했어요.</p>
			<p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => router.push("/connect")}
					className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700">
					목록으로
				</button>
				<button
					type="button"
					onClick={reset}
					className="rounded-xl bg-purple-500 px-4 py-2 text-sm text-white">
					다시 시도
				</button>
			</div>
		</div>
	);
}
