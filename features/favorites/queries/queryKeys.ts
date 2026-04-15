import { FavoriteMeetingsListKeyParams } from "../types";

const FAVORITES_QUERY_BASE_KEY = ["favorites"] as const;

export const queryKeys = {
	favorites: {
		all: FAVORITES_QUERY_BASE_KEY,
		list: (params: FavoriteMeetingsListKeyParams) =>
			[...FAVORITES_QUERY_BASE_KEY, "list", params] as const,
	},
};
