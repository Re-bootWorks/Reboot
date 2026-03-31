"use client";

import { useRouter } from "next/navigation";

export default function SectionErrorFallback() {
	const router = useRouter();

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-white py-10">
			<p className="text-sm font-medium text-gray-500">데이터를 불러오지 못했습니다.</p>
			<button
				onClick={() => router.refresh()}
				className="rounded-xl bg-purple-500 px-6 py-2 text-sm text-white">
				다시 시도
			</button>
		</div>
	);
}
