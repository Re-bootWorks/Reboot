"use client";

import useToggle from "@/hooks/useToggle";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateModal = dynamic(() => import("./components/CreateModal"), { ssr: false });

export default function MeetUpCreate() {
	const router = useRouter();
	const { close } = useToggle();
	const [isPending, setIsPending] = useState(false);

	function handleClickClose() {
		close();
		router.back();
	}

	async function handleSubmit() {
		setIsPending(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsPending(false);
	}
	return (
		<CreateModal
			isOpen={true}
			onClose={handleClickClose}
			onSubmit={handleSubmit}
			isPending={isPending}
		/>
	);
}
