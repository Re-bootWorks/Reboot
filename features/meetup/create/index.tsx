"use client";

import useToggle from "@/hooks/useToggle";
import { useToast } from "@/providers/toast-provider";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createSessionStore } from "./utils";

const CreateModal = dynamic(() => import("./components/CreateModal"), { ssr: false });

export default function MeetUpCreate() {
	const { handleShowToast } = useToast();
	const router = useRouter();
	const { isOpen, close } = useToggle(true);

	function handleClickClose() {
		close();
		router.back();
	}

	function redirectToDetail(id: number) {
		createSessionStore.remove();
		handleShowToast({ message: "모임 생성이 완료되었습니다!", status: "success" });
		close();
		setTimeout(() => router.replace(`/meetup/${id}`), 1000);
	}

	return <CreateModal isOpen={isOpen} onClose={handleClickClose} onSuccess={redirectToDetail} />;
}
