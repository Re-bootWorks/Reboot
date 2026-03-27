"use client";

import { useRouter } from "next/navigation";
import CreateButton from "@/components/ui/Buttons/CreateButton";

export default function CreateOpenButton({ className }: { className?: string }) {
	const router = useRouter();

	return (
		<CreateButton className={className} onClick={() => router.push("/meetup/create")}>
			모임 만들기
		</CreateButton>
	);
}
