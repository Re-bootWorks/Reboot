"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import CreateModal from "./components/CreateModal";
import CreateOpenButton from "./components/CreateOpenButton";

export default function MeetUpCreate() {
	const { isOpen, open, close } = useModal();
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit() {
		setIsPending(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsPending(false);
	}

	return (
		<>
			<CreateOpenButton onClick={open} />
			<CreateModal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} isPending={isPending} />
		</>
	);
}
