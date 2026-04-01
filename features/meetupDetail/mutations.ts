import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import {
	deleteFavorite,
	deleteJoin,
	deleteMeeting,
	patchMeeting,
	postFavorite,
	postJoin,
} from "@/features/meetupDetail/apis/apis";
import { meetupDetailQueryKeys } from "./queries";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useRouter } from "next/navigation";
import { Meeting } from "@/features/meetupDetail/types";
import { MeetupListResponse } from "@/features/meetup/types";

/** 모임 참여 뮤테이션 */
export function useJoinMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => postJoin(meetingId),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) });

			const prevData = queryClient.getQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId));

			queryClient.setQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId), (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					isJoined: true,
					participantCount: oldData.participantCount + 1,
				};
			});

			return { prevData };
		},
		onSuccess: () => {
			handleShowToast({ message: "모임에 참여했습니다.", status: "success" });
		},
		onError: (error: Error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting(meetingId), context.prevData);
			}
			handleShowToast({ message: error.message, status: "error" });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
		},
	});
}

/** 모임 찜하기 뮤테이션 */
export function useFavoriteMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: ({ currentState }: { currentState: boolean }) =>
			currentState ? deleteFavorite(meetingId) : postFavorite(meetingId),

		// API 호출 전 낙관적 업데이트
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.related.all() });

			// 이전 데이터 백업
			const prevData = queryClient.getQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId));
			const prevRelatedQueries = queryClient.getQueriesData<MeetupListResponse>({
				queryKey: meetupDetailQueryKeys.related.all(),
			});

			// meetupDetail 캐시 낙관적 업데이트
			queryClient.setQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId), (oldData) => {
				if (!oldData) return oldData;
				return { ...oldData, isFavorited: !oldData.isFavorited };
			});

			queryClient.setQueriesData<MeetupListResponse>(
				{ queryKey: meetupDetailQueryKeys.related.all() },
				(oldData) => {
					if (!oldData || !oldData.data) return oldData;
					return {
						...oldData,
						data: oldData.data.map((item) =>
							item.id === meetingId ? { ...item, isFavorited: !item.isFavorited } : item,
						),
					};
				},
			);

			return { prevData, prevRelatedQueries };
		},
		onSuccess: (_, { currentState }) => {
			handleShowToast({
				message: currentState ? "모임이 찜 해제되었습니다." : "모임이 찜 추가되었습니다.",
				status: "success",
			});
		},
		onError: (_error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting(meetingId), context.prevData);
			}
			if (context?.prevRelatedQueries) {
				context.prevRelatedQueries.forEach(([queryKey, oldData]) => {
					queryClient.setQueryData(queryKey, oldData);
				});
			}
			handleShowToast({ message: "찜 처리에 실패했습니다.", status: "error" });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: ["header", "favorites"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
		},
	});
}

/** 모임 참여 취소 뮤테이션 */
export function useCancelJoinMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => deleteJoin(meetingId),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });

			const prevData = queryClient.getQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId));

			// 낙관적 업데이트 — isJoined, participantCount 미리 변경
			queryClient.setQueryData<Meeting>(meetupDetailQueryKeys.meeting(meetingId), (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					isJoined: false,
					participantCount: oldData.participantCount - 1,
				};
			});

			return { prevData };
		},

		onSuccess: () => {
			handleShowToast({ message: "참여를 취소했습니다.", status: "success" });
		},

		onError: (error: Error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting(meetingId), context.prevData);
			}
			handleShowToast({ message: error.message, status: "error" });
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
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
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "meetups"] });
			queryClient.invalidateQueries({ queryKey: ["mypage", "created"] });
			handleShowToast({ message: "모임이 삭제되었습니다.", status: "success" });
			router.replace("/meetup/list");
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}
