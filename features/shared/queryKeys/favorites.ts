import { FavoriteMeetingsListKeyParams } from "@/features/favorites/types";

const FAVORITES_QUERY_BASE_KEY = ["favorites"] as const;

/** 찜하기/찜해제 관련된 경우 = favoritesQueryKey.all */
export const favoritesQueryKeys = {
	favorites: {
		all: FAVORITES_QUERY_BASE_KEY,
		list: (params: FavoriteMeetingsListKeyParams) =>
			[...FAVORITES_QUERY_BASE_KEY, "list", params] as const,
	},
};
