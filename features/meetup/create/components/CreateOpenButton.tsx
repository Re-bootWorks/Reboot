"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import CreateButton from "@/components/ui/Buttons/CreateButton";
import { useUserStore } from "@/store/user.store";
import { useToast } from "@/providers/toast-provider";

export default function CreateOpenButton({ className }: { className?: string }) {
	const { user } = useUserStore();
	const { handleShowToast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queries = searchParams.toString();

	return (
		<CreateButton
			className={cn("shadow-lg transition-transform duration-300 hover:-translate-y-1", className)}
			onClick={() => {
				if (user) {
					router.push(`/meetup/create${queries ? `?${queries}` : ""}`);
				} else {
					handleShowToast({ message: "로그인 후 이용해주세요.", status: "error" });
				}
			}}>
			모임 만들기
		</CreateButton>
	);
}
