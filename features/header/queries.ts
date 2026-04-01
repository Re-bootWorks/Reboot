import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFavoritesCount, getNotifications, getNotificationUnreadCount } from "./apis";
import { useUserStore } from "@/store/user.store";

export const headerQueryKeys = {
	// 찜 개수
	all: ["header"] as const,
	favorites: ["header", "favorites"] as const,
	notifications: ["header", "notifications"] as const,
	notificationsCount: ["header", "notifications", "count"] as const,
} as const;

// 찜한 갯수
export function useGetFavoritesCount() {
	const user = useUserStore((state) => state.user);

	return useQuery({
		queryKey: headerQueryKeys.favorites,
		queryFn: getFavoritesCount,
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});
}

// 알림 목록
export function useGetNotifications() {
	const user = useUserStore((state) => state.user);

	return useInfiniteQuery({
		queryKey: headerQueryKeys.notifications,
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
	const user = useUserStore((state) => state.user);

	return useQuery({
		queryKey: headerQueryKeys.notificationsCount,
		queryFn: getNotificationUnreadCount,
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});
}
