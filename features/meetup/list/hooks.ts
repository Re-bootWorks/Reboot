import { useRef } from "react";
import { InfiniteData, QueryKey, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import { meetupQueryKeys } from "../queries";
import { queryKeys } from "@/features/favorites/queries/queryKeys";
import type { MeetupListResponse } from "../types";
import { meetupDetailQueryKeys } from "@/features/shared/queryKeys/meetupDetail";
import { headerQueryKeys } from "@/features/shared/queryKeys/header";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";

export function useMeetupToggle(meetingId: number, field: "isJoined" | "isFavorited") {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();
	const snapshotRef = useRef<[QueryKey, unknown][]>([]);

	async function onMutate() {
		// 목록 쿼리 refetch 취소
		await queryClient.cancelQueries({ queryKey: meetupQueryKeys.list });

		// 목록 쿼리 데이터를 캐시에 백업
		snapshotRef.current = queryClient.getQueriesData({ queryKey: meetupQueryKeys.list });

		// 목록 쿼리 Optimistic Update
		queryClient.setQueriesData<InfiniteData<MeetupListResponse>>(
			{ queryKey: meetupQueryKeys.list },
			(oldData) => {
				if (!oldData?.pages) return oldData;
				return {
					...oldData,
					pages: oldData.pages.map((page) => ({
						...page,
						data: page.data.map((item) => {
							if (item.id !== meetingId) return item;
							if (field === "isFavorited") {
								return { ...item, isFavorited: !item.isFavorited };
							} else {
								const nextJoined = !item.isJoined;
								const delta = nextJoined ? 1 : -1;
								return {
									...item,
									isJoined: nextJoined,
									participantCount: Math.min(
										item.capacity,
										Math.max(0, item.participantCount + delta),
									),
								};
							}
						}),
					})),
				};
			},
		);
	}

	function onSuccess(message: string) {
		handleShowToast({ message, status: "success" });
		// 목록 쿼리를 포함한 연관 쿼리 무효화
		queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list, refetchType: "none" }); // 모임 목록 stale 처리(refetch X)
		queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting.detail(meetingId) }); // 해당 모임 상세
		queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all }); // 참여한 /만든 모임 목록

		if (field === "isFavorited") {
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.favorites }); // 찜 개수
			queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }); // 찜한 목록
		}
		if (field === "isJoined") {
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.participants.detail(meetingId),
			}); // 해당 모임 참여자
			// 참여 가능 인원이 초과되어 해당 모임이 확정되는 경우
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications.all }); // 알림 목록
		}
	}

	function onError(error: Error) {
		// 목록 쿼리 데이터 롤백
		snapshotRef.current.forEach(([key, cacheData]) => {
			queryClient.setQueryData(key, cacheData);
		});
		handleShowToast({ message: error.message, status: "error" });
	}

	return { onMutate, onSuccess, onError };
}
