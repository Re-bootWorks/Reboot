"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import CreateButton from "@/components/ui/Buttons/CreateButton";
import { useUser } from "@/hooks/useUser";
import { useModalStore } from "@/store/modal.store";
import { useToast } from "@/providers/toast-provider";

export default function CreateOpenButton({ className }: { className?: string }) {
	const { user } = useUser();
	const { openLogin } = useModalStore();
	const { handleShowToast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queries = searchParams.toString();

	return (
		<CreateButton
			className={cn("shadow-lg transition-transform duration-300 hover:-translate-y-1", className)}
			onClick={() => {
				if (user) {
					// 모임 목록 페이지 데이터 변경 이슈 해결을 위한 querystring 추가
					const url = `/meetup/create${queries ? `?${queries}` : ""}`;
					router.push(url, { scroll: false });
				} else {
					handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
					openLogin();
				}
			}}>
			모임 만들기
		</CreateButton>
	);
}
