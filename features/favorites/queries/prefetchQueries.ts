import { QueryClient } from "@tanstack/react-query";
import { FavoritesListRequest } from "../types";
import { favoritesInfiniteOptions } from "./queryOptions";
import { getFavorites } from "../apis/server";

export async function prefetchFavorites(queryClient: QueryClient, params: FavoritesListRequest) {
	await queryClient.prefetchInfiniteQuery(favoritesInfiniteOptions(params, getFavorites));
}
