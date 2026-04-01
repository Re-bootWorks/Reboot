import { useRef } from "react";
import { useToast } from "@/providers/toast-provider";
import { InfiniteData, QueryKey, useQueryClient } from "@tanstack/react-query";
import { GET_MEETUPS_QUERY_KEY } from "../queries";
import { meetupDetailQueryKeys } from "@/features/meetupDetail/queries";

interface ToggleItem {
	id: number;
	isJoined: boolean;
	isFavorited: boolean;
}

interface TogglePage {
	data: ToggleItem[];
}

const INVALIDATE_PREFIXES = [GET_MEETUPS_QUERY_KEY, ["mypage", "meetups"], ["mypage", "created"]];

export function useMeetupToggle(meetingId: number, field: "isJoined" | "isFavorited") {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();
	const snapshotRef = useRef<[QueryKey, unknown][]>([]);

	async function onMutate() {
		// 목록 쿼리 refetch 취소
		await queryClient.cancelQueries({ queryKey: GET_MEETUPS_QUERY_KEY });

		// 목록 쿼리 데이터를 캐시에 백업
		snapshotRef.current = queryClient.getQueriesData({ queryKey: GET_MEETUPS_QUERY_KEY });

		// 목록 쿼리 Optimistic Update
		queryClient.setQueriesData<InfiniteData<TogglePage>>(
			{ queryKey: GET_MEETUPS_QUERY_KEY },
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
		INVALIDATE_PREFIXES.forEach((queryKey) => {
			queryClient.invalidateQueries({ queryKey });
		});
		// 모임 상세 페이지 쿼리 무효화
		queryClient.invalidateQueries({ queryKey: meetupDetailQueryKeys.meeting(meetingId) });
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
