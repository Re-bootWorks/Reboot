"use client";

import { useRouter } from "next/navigation";
import CreateButton from "@/components/ui/Buttons/CreateButton";

export default function CreateOpenButton() {
	const router = useRouter();

	return <CreateButton onClick={() => router.push("/meetup/create")}>모임 만들기</CreateButton>;
}
