import type {
	FavoriteMeeting,
	FavoritesListRequest,
	FavoritesListResponse,
} from "@/features/favorites/types";
import { buildFavoritesListResponse } from "./helpers";
import { FAVORITED_AT_BY_MEETING_ID } from "./fixtures";
import { MEETINGS } from "../meetings/fixtures";

const CURRENT_USER_ID = 1;

type MeetingRow = (typeof MEETINGS.data)[number];

function getFavoriteCreatedAt(meeting: MeetingRow) {
	return FAVORITED_AT_BY_MEETING_ID[meeting.id] ?? meeting.updatedAt ?? meeting.createdAt;
}

function toFavoriteMeeting(meeting: MeetingRow): FavoriteMeeting {
	const {
		id,
		teamId,
		name,
		type,
		region,
		address,
		latitude,
		longitude,
		dateTime,
		registrationEnd,
		capacity,
		participantCount,
		image,
		description,
		canceledAt,
		confirmedAt,
		hostId,
		createdAt,
		updatedAt,
		host,
		isCompleted,
		isJoined,
	} = meeting;

	return {
		id,
		meetingId: id,
		userId: CURRENT_USER_ID,
		createdAt: getFavoriteCreatedAt(meeting),
		meeting: {
			id,
			teamId,
			name,
			type,
			region,
			address,
			latitude,
			longitude,
			dateTime,
			registrationEnd,
			capacity,
			participantCount,
			image,
			description,
			canceledAt,
			confirmedAt,
			hostId,
			createdAt,
			updatedAt,
			host,
			isCompleted,
			isJoined,
		},
	};
}

function getFavoriteRows(): FavoriteMeeting[] {
	return MEETINGS.data.filter((meeting) => meeting.isFavorited).map(toFavoriteMeeting);
}

function listFavorites(params: FavoritesListRequest = {}): FavoritesListResponse {
	return buildFavoritesListResponse(getFavoriteRows(), params);
}

function getFavoritesCount() {
	return getFavoriteRows().length;
}

const favorites = {
	list: listFavorites,
	getCount: getFavoritesCount,
};

export default favorites;
