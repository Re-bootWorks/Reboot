import { useToast } from "@/providers/toast-provider";
import { useRouter } from "next/navigation";
import { createSessionStore } from "./utils";
import { MEETUP_DETAIL_PATH } from "@/constants/navigation";

interface UseCreateMeetupProps {
	/** 모달 닫기 함수 */
	close?: () => void;
}
export function useCreateMeetup({ close }: UseCreateMeetupProps = {}) {
	const { handleShowToast } = useToast();
	const router = useRouter();

	function onClose() {
		if (close) close();
		router.back();
	}

	function onSuccess(id: number) {
		createSessionStore.remove();
		handleShowToast({ message: "모임 생성이 완료되었습니다!", status: "success" });
		if (close) close();
		setTimeout(() => router.replace(MEETUP_DETAIL_PATH(id)), 2000);
	}

	return { onClose, onSuccess };
}
