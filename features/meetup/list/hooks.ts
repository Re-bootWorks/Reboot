import { useRef } from "react";
import { InfiniteData, QueryKey, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import { meetupQueryKeys } from "../queries";
import { meetupDetailQueryKeys } from "@/features/meetupDetail/queries";
import { mypageQueryKeys } from "@/features/mypage/queries";
import { headerQueryKeys } from "@/features/header/queries";

interface ToggleItem {
	id: number;
	isJoined: boolean;
	isFavorited: boolean;
}

interface TogglePage {
	data: ToggleItem[];
}

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
		queryClient.setQueriesData<InfiniteData<TogglePage>>(
			{ queryKey: meetupQueryKeys.list },
			(oldData) => {
				if (!oldData?.pages) return oldData;
				return {
					...oldData,
					pages: oldData.pages.map((page) => ({
						...page,
						data: page.data.map((item) =>
							item.id === meetingId ? { ...item, [field]: !item[field] } : item,
						),
					})),
				};
			},
		);
	}

	function onSuccess(message: string) {
		handleShowToast({ message, status: "success" });
		// 목록 쿼리를 포함한 연관 쿼리 무효화
		queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list }); // 모임 목록
		queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) }); // 해당 모임 상세
		queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups }); // 참여한 모임 목록
		queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created }); // 만든 모임 목록(주최자)

		if (field === "isFavorited") {
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.favorites }); // 찜 개수
		}
		if (field === "isJoined") {
			queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.participants(meetingId) }); // 해당 모임 참여자
			// 참여 가능 인원이 초과되어 해당 모임이 확정되는 경우
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications }); // 알림 목록
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.notificationsCount }); // 알림 개수
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
