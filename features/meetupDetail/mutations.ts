import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import {
	deleteJoin,
	deleteMeeting,
	patchMeeting,
	postJoin,
} from "@/features/meetupDetail/apis/apis";
import { meetupDetailQueryKeys } from "./queries";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useRouter } from "next/navigation";

/** 모임 참여 뮤테이션 */
export function useJoinMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => postJoin(meetingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) });
			handleShowToast({ message: "모임에 참여했습니다.", status: "success" });
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

/** 모임 참여 취소 뮤테이션 */
export function useCancelJoinMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => deleteJoin(meetingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) });
			handleShowToast({ message: "참여를 취소했습니다.", status: "success" });
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

/** 모임 수정 뮤테이션 */
export function useEditMeetingMutation(meetingId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: MeetupEditData) => patchMeeting(meetingId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
		},
	});
}

/** 모임 삭제 뮤테이션 */
export function useDeleteMeetingMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();
	const router = useRouter();

	return useMutation({
		mutationFn: () => deleteMeeting(meetingId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			handleShowToast({ message: "모임이 삭제되었습니다.", status: "success" });
			router.replace("/meetup/list");
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}
