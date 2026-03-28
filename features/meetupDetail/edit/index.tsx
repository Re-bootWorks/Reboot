"use client";

import { useState } from "react";
import EditModal from "./components/EditModal";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";

interface EditMeetupProps {
	initialData: MeetupEditData;
	isOpen: boolean;
	onClose: () => void;
}

export default function EditMeetup({ initialData, isOpen, onClose }: EditMeetupProps) {
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(_data: MeetupEditData) {
		setIsPending(true);

		try {
			// TODO: 추후 실제 수정 API 연동 예정
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} finally {
			setIsPending(false);
		}
	}

	return (
		<EditModal
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			isPending={isPending}
			initialData={initialData}
		/>
	);
}
