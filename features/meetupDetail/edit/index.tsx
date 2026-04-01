"use client";

import EditModal from "./components/EditModal";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useEditMeetingMutation } from "@/features/meetupDetail/mutations";

interface EditMeetupProps {
	meetingId: number;
	participantCount: number;
	initialData: MeetupEditData;
	isOpen: boolean;
	onClose: () => void;
}

export default function EditMeetup({
	meetingId,
	participantCount,
	initialData,
	isOpen,
	onClose,
}: EditMeetupProps) {
	const { mutateAsync, isPending } = useEditMeetingMutation(meetingId);

	async function handleSubmit(data: MeetupEditData) {
		await mutateAsync(data);
	}

	return (
		<EditModal
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			isPending={isPending}
			participantCount={participantCount}
			initialData={initialData}
		/>
	);
}
