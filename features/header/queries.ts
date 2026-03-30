import { useQuery } from "@tanstack/react-query";
import { getFavoritesCount } from "./apis";
import { useUserStore } from "@/store/user.store";

export const headerQueryKeys = {
	// 찜 개수
	favorites: ["favorites", "count"] as const,
} as const;

export function useGetFavoritesCount() {
	const user = useUserStore((state) => state.user);

	return useQuery({
		queryKey: headerQueryKeys.favorites,
		queryFn: getFavoritesCount,
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});
}
