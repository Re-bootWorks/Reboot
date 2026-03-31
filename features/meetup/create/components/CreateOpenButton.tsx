"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import CreateButton from "@/components/ui/Buttons/CreateButton";

export default function CreateOpenButton({ className }: { className?: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queries = searchParams.toString();

	return (
		<CreateButton
			className={cn("shadow-lg transition-transform duration-300 hover:-translate-y-1", className)}
			onClick={() => router.push(`/meetup/create${queries ? `?${queries}` : ""}`)}>
			모임 만들기
		</CreateButton>
	);
}
