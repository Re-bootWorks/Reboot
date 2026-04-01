"use client";

import { useRouter } from "next/navigation";
import PageIntro from "@/components/ui/PageIntro";
import Button from "@/components/ui/Buttons/Button";
import IcPlus from "@/components/ui/icons/IcPlus";

export default function IntroSection() {
	const router = useRouter();

	return (
		<>
			{/* 상단 인트로 + PC 버튼 */}
			<div className="mt-12 flex items-center justify-between">
				<PageIntro />

				<Button
					onClick={() => router.push("/connect/create")}
					sizes="large"
					className="mt-auto hidden h-[64px] w-[221px] items-center gap-2 rounded-[24px] sm:flex">
					<IcPlus size="lg" />
					게시물 등록하기
				</Button>
			</div>

			{/* 모바일 FAB */}
			<Button
				onClick={() => router.push("/connect/create")}
				className="fixed right-6 bottom-6 z-50 flex h-14 w-14 min-w-0 items-center justify-center rounded-full !px-0 shadow-lg md:hidden">
				<IcPlus size="lg" />
			</Button>
		</>
	);
}
