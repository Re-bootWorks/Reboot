"use client";

import useToggle from "@/hooks/useToggle";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CreateModal = dynamic(() => import("./components/CreateModal"), { ssr: false });

export default function MeetUpCreate() {
	const router = useRouter();
	const { close } = useToggle();

	function handleClickClose() {
		close();
		router.back();
	}

	function redirectToDetail(id: number) {
		router.replace(`/meetup/${id}`);
	}

	return <CreateModal isOpen={true} onClose={handleClickClose} onSuccess={redirectToDetail} />;
}
