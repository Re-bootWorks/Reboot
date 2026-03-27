"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modals";
import PageTabs from "@/components/ui/PageTabs";
import Button from "@/components/ui/Buttons/Button";
import TabBasicInfo from "@/features/meetupDetail/edit/components/TabBasicInfo";
import TabSchedule from "@/features/meetupDetail/edit/components/TabSchedule";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import EditFormDataProvider, {
	useEditFormData,
} from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { useToast } from "@/providers/toast-provider";

interface EditModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: MeetupEditData) => Promise<void>;
	isPending: boolean;
	initialData: MeetupEditData;
}

interface EditFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: MeetupEditData) => Promise<void>;
	isPending: boolean;
}

const TAB_IDS = {
	BASIC: "basic",
	SCHEDULE: "schedule",
} as const;

type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

export default function EditModal({
	isOpen,
	onClose,
	onSubmit,
	isPending,
	initialData,
}: EditModalProps) {
	return (
		<EditFormDataProvider isOpen={isOpen} initialData={initialData}>
			<EditForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} isPending={isPending} />
		</EditFormDataProvider>
	);
}

function EditForm({ onClose, isOpen, onSubmit, isPending }: EditFormProps) {
	const { data } = useEditFormData();
	const [activeTab, setActiveTab] = useState<TabId>(TAB_IDS.BASIC);

	const { handleShowToast } = useToast();

	useEffect(() => {
		if (!isOpen) {
			setActiveTab(TAB_IDS.BASIC);
		}
	}, [isOpen]);

	async function handleSubmit() {
		try {
			await onSubmit(data);
			handleShowToast({ message: "모임이 수정되었습니다.", status: "success" });
			onClose();
		} catch (error) {
			handleShowToast({
				message: error instanceof Error ? error.message : "수정 중 오류가 발생했습니다.",
				status: "error",
			});
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="모임 수정하기"
			footer={
				<div className="flex gap-3">
					<Button colors="grayBorder" className="flex-1" onClick={onClose}>
						취소
					</Button>
					<Button className="flex-1" isPending={isPending} onClick={handleSubmit}>
						수정하기
					</Button>
				</div>
			}>
			{/* 탭 */}
			<PageTabs defaultId={TAB_IDS.BASIC} onChange={({ id }) => setActiveTab(id as TabId)}>
				<PageTabs.Item id={TAB_IDS.BASIC}>기본 정보</PageTabs.Item>
				<PageTabs.Item id={TAB_IDS.SCHEDULE}>일정 및 인원</PageTabs.Item>
			</PageTabs>

			{/* 탭 컨텐츠 */}
			<div className="mt-6">
				{activeTab === TAB_IDS.BASIC && <TabBasicInfo />}
				{activeTab === TAB_IDS.SCHEDULE && <TabSchedule />}
			</div>
		</Modal>
	);
}
