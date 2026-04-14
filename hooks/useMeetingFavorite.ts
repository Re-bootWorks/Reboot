"use client";

import { CursorPageResponse, MeetupList } from "@/features/mypage/types";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { headerQueryKeys } from "@/features/header/queries";
import { deleteMeetingsFavorites, postMeetingsFavorites } from "@/features/mypage/apis";
import { meetupDetailQueryKeys } from "@/features/meetupDetail/queries";
import { meetupQueryKeys } from "@/features/meetup/queries";
import { mypageQueryKeys } from "@/features/mypage/queries";

/**
 * 찜 추가 시 낙관적 업데이트 및 롤백 하는 훅
 *
 * @example
 * const { handleWishToggle } = useMeetingFavorite();
 * handleWishToggle(item.id, item.isFavorited)
 */

const favoriteQueryPrefixes = [mypageQueryKeys.meetup.all];

export default function useMeetingFavorite() {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: ({ meetingId, currentState }: { meetingId: number; currentState: boolean }) =>
			currentState ? deleteMeetingsFavorites(meetingId) : postMeetingsFavorites(meetingId),

		// API 호출 전에 실행
		onMutate: async ({ meetingId }) => {
			// 찜 관련 캐시 전부 취소 refetch 완료시 낙관적 업데이트가 덮어 씌워지는 것 방지
			await Promise.all(
				favoriteQueryPrefixes.map((queryKey) => queryClient.cancelQueries({ queryKey })),
			);

			// API 실패시 이전 값으로 롤백
			const prevDataList = favoriteQueryPrefixes.map((queryKey) => ({
				queryKey,
				data: queryClient.getQueriesData({ queryKey }),
			}));

			// 캐시 낙관적 업데이트 (api 응답 전 캐시수정)
			favoriteQueryPrefixes.forEach((queryKey) => {
				queryClient.setQueriesData<InfiniteData<CursorPageResponse<MeetupList>>>(
					{ queryKey },
					(oldData) => {
						if (!oldData) return oldData;
						return {
							...oldData,
							pages: oldData.pages.map((page) => ({
								...page,
								data: page.data.map((item) =>
									item.id === meetingId ? { ...item, isFavorited: !item.isFavorited } : item,
								),
							})),
						};
					},
				);
			});
			// 백업데이터 전달
			return { prevDataList };
		},

		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: headerQueryKeys.favorites });
			queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list });
			queryClient.invalidateQueries({
				queryKey: meetupDetailQueryKeys.meeting(variables.meetingId),
			});
		},
		// 실패시 롤백
		onError: (_error, _variables, context) => {
			context?.prevDataList.forEach(({ data }) => {
				data.forEach(([queryKey, cacheData]) => {
					queryClient.setQueryData(queryKey, cacheData);
				});
			});
		},
	});

	function handleWishToggle(meetingId: number, currentState: boolean) {
		mutate({ meetingId, currentState });
	}
	return {
		handleWishToggle,
	};
}
