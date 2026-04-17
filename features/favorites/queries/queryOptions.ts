import { FavoritesListRequest, FavoritesListResponse } from "../types";
import { favoritesQueryKeys } from "@/features/shared/queryKeys/favorites";

export function favoritesInfiniteOptions(
	params: FavoritesListRequest,
	getFavorites: (params: FavoritesListRequest) => Promise<FavoritesListResponse>,
) {
	const { cursor, ...rest } = params;
	const querykeyParams = { ...rest };

	return {
		queryKey: favoritesQueryKeys.favorites.list(querykeyParams),
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			getFavorites({
				...params,
				cursor: pageParam ?? undefined,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: FavoritesListResponse) => {
			if (!lastPage.hasMore) return undefined;
			return lastPage.nextCursor ?? undefined;
		},
		staleTime: 60 * 1000,
		gcTime: 5 * 60 * 1000,
	};
}
