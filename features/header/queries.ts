import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFavoritesCount, getNotifications, getNotificationUnreadCount } from "./apis";
import { useUser } from "@/hooks/useUser";
import { headerQueryKeys } from "@/features/shared/queryKeys/header";

// 찜한 갯수
export function useGetFavoritesCount() {
	const { user } = useUser();
	return useQuery({
		queryKey: headerQueryKeys.favorites,
		queryFn: getFavoritesCount,
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});
}

// 알림 목록
export function useGetNotifications() {
	const { user } = useUser();

	return useInfiniteQuery({
		queryKey: headerQueryKeys.notifications.all,
		queryFn: ({ pageParam }) => getNotifications(pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
		initialPageParam: undefined as string | undefined,
		staleTime: 1000 * 30,
		enabled: !!user,
	});
}

// 읽지 않은 알림 갯수
export function useGetNotificationsCount() {
	const { user } = useUser();

	return useQuery({
		queryKey: headerQueryKeys.notifications.count,
		queryFn: getNotificationUnreadCount,
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});
}
