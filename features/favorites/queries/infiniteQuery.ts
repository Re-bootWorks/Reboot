"use client";

import { useMemo } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { FavoriteCardItem, FavoritesListRequest } from "../types";
import { favoritesInfiniteOptions } from "./queryOptions";
import { getFavorites } from "../apis/client";

export function useFavoritesInfiniteQuery(params: FavoritesListRequest) {
	const response = useSuspenseInfiniteQuery(favoritesInfiniteOptions(params, getFavorites));

	const flatData = useMemo(() => {
		const mappedData =
			response.data?.pages.flatMap((page): FavoriteCardItem[] =>
				(page.data ?? []).map((favorite) => ({
					id: favorite.id,
					meetingId: favorite.meetingId,
					userId: favorite.userId,
					meetingName: favorite.meeting.name,
					meetingType: favorite.meeting.type,
					meetingRegion: favorite.meeting.region,
					meetingImage: favorite.meeting.image,
					meetingDateTime: favorite.meeting.dateTime,
					meetingAddress: favorite.meeting.address,
					registrationEnd: favorite.meeting.registrationEnd,
					capacity: favorite.meeting.capacity,
					participantCount: favorite.meeting.participantCount,
					isCompleted: favorite.meeting.isCompleted,
					isJoined: favorite.meeting.isJoined,
					confirmedAt: favorite.meeting.confirmedAt,
					canceledAt: favorite.meeting.canceledAt,
				})),
			) ?? [];

		const seen = new Set<FavoriteCardItem["id"]>();

		return mappedData.filter((favorite) => {
			if (seen.has(favorite.id)) return false;
			seen.add(favorite.id);
			return true;
		});
	}, [response.data]);

	return {
		...response,
		data: flatData,
	};
}
