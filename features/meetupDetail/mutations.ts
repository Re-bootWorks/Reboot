import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import {
	deleteFavorite,
	deleteJoin,
	deleteMeeting,
	deleteReview,
	patchMeeting,
	patchReview,
	postFavorite,
	postJoin,
} from "@/features/meetupDetail/apis/apis";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useRouter } from "next/navigation";
import { Meeting } from "@/features/meetupDetail/types";
import { MeetupListResponse } from "@/features/meetup/types";
import { ReviewScore } from "@/types/common";
import { meetupDetailQueryKeys } from "@/features/shared/queryKeys/meetupDetail";
import { headerQueryKeys } from "@/features/shared/queryKeys/header";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";

/** 모임 참여 뮤테이션 */
export function useJoinMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => postJoin(meetingId),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(meetingId),
			});
			await queryClient.cancelQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(meetingId),
			});

			const prevData = queryClient.getQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
			);

			queryClient.setQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						isJoined: true,
						participantCount: oldData.participantCount + 1,
					};
				},
			);

			return { prevData };
		},
		onSuccess: () => {
			handleShowToast({ message: "모임에 참여했습니다.", status: "success" });
		},
		onError: (error: Error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting.detail(meetingId), context.prevData);
			}
			handleShowToast({ message: error.message, status: "error" });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(meetingId),
			});
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications.all });
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
			await queryClient.cancelQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(meetingId),
			});
			await queryClient.cancelQueries({ queryKey: meetupDetailQueryKeys.related.all });

			// 이전 데이터 백업
			const prevData = queryClient.getQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
			);
			const prevRelatedQueries = queryClient.getQueriesData<MeetupListResponse>({
				queryKey: meetupDetailQueryKeys.related.all,
			});

			// meetupDetail 캐시 낙관적 업데이트
			queryClient.setQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
				(oldData) => {
					if (!oldData) return oldData;
					return { ...oldData, isFavorited: !oldData.isFavorited };
				},
			);

			queryClient.setQueriesData<MeetupListResponse>(
				{ queryKey: meetupDetailQueryKeys.related.all },
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
		onError: (error: Error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting.detail(meetingId), context.prevData);
			}
			if (context?.prevRelatedQueries) {
				context.prevRelatedQueries.forEach(([queryKey, oldData]) => {
					queryClient.setQueryData(queryKey, oldData);
				});
			}
			handleShowToast({ message: error.message, status: "error" });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) });

			queryClient.invalidateQueries({ queryKey: headerQueryKeys.favorites });
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
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
			await queryClient.cancelQueries({
				queryKey: meetupDetailQueryKeys.meeting.detail(meetingId),
			});
			await queryClient.cancelQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(meetingId),
			});

			const prevData = queryClient.getQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
			);

			// 낙관적 업데이트 — isJoined, participantCount 미리 변경
			queryClient.setQueryData<Meeting>(
				meetupDetailQueryKeys.meeting.detail(meetingId),
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						isJoined: false,
						participantCount: oldData.participantCount - 1,
					};
				},
			);

			return { prevData };
		},

		onSuccess: () => {
			handleShowToast({ message: "참여를 취소했습니다.", status: "success" });
		},

		onError: (error: Error, _variables, context) => {
			if (context?.prevData) {
				queryClient.setQueryData(meetupDetailQueryKeys.meeting.detail(meetingId), context.prevData);
			}
			handleShowToast({ message: error.message, status: "error" });
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(meetingId),
			});
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications.all });
		},
	});
}

/** 모임 수정 뮤테이션 */
export function useEditMeetingMutation(meetingId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: MeetupEditData) => patchMeeting(meetingId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) });
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
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["meetup", "list"] });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all });
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.all });
			handleShowToast({ message: "모임이 삭제되었습니다.", status: "success" });
			router.replace("/meetup/list");
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

/** 리뷰 수정 뮤테이션 */
export function useEditReviewMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: ({
			reviewId,
			data,
		}: {
			reviewId: number;
			data: { score: ReviewScore; comment: string };
		}) => patchReview(reviewId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.reviews.detail(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			handleShowToast({ message: "리뷰가 수정되었습니다.", status: "success" });
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}

/** 리뷰 삭제 뮤테이션 */
export function useDeleteReviewMutation(meetingId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: (reviewId: number) => deleteReview(reviewId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.reviews.detail(meetingId) });
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			handleShowToast({ message: "리뷰가 삭제되었습니다.", status: "success" });
		},
		onError: (error: Error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});
}
