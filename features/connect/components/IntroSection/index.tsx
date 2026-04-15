"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import CreateButton from "@/components/ui/Buttons/CreateButton";
import { useUser } from "@/hooks/useUser";
import { useModalStore } from "@/store/modal.store";
import { useToast } from "@/providers/toast-provider";

// Banner는 클라이언트 컴포넌트를 사용하기 때문에
// 서버에서 렌더링 시 절대 URL이 없어 에러가 발생함
// ssr: false로 클라이언트에서만 렌더링되도록 처리
const Banner = dynamic(() => import("@/features/connect/components/Banner"), { ssr: false });

export default function IntroSection() {
	const router = useRouter();
	const { user } = useUser();
	const { openLogin } = useModalStore();
	const { handleShowToast } = useToast();

	return (
		<>
			{/* 배너 */}
			<div className="mt-0 md:-mx-1 md:mt-6.5">
				<Suspense
					fallback={
						<div className="h-48 w-full animate-pulse bg-purple-100 md:h-[244px] md:rounded-3xl lg:rounded-4xl" />
					}>
					<Banner />
				</Suspense>
			</div>

			{/* 게시물 등록 버튼 */}
			<CreateButton
				className="fixed right-6 bottom-6 z-10 shadow-lg transition-transform duration-300 hover:-translate-y-1"
				onClick={() => {
					if (user) {
						router.push("/connect/create");
					} else {
						handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
						openLogin();
					}
				}}>
				게시물 등록
			</CreateButton>
		</>
	);
}
