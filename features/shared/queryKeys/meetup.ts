import { MeetupListRequest } from "@/features/meetup/types";

const MEETUP_QUERY_BASE_KEY = ["meetup"] as const;

export const meetupQueryKeys = {
	all: MEETUP_QUERY_BASE_KEY,
	list: [...MEETUP_QUERY_BASE_KEY, "list"] as const,
	listWithParams: (params: MeetupListRequest) =>
		[...MEETUP_QUERY_BASE_KEY, "list", params] as const,
} as const;

export const meetupMutationKeys = {
	postMeetup: ["meetup", "post"] as const,
	uploadImage: ["meetup", "image", "upload"] as const,
	postFavorite: ["meetings", "favorite", "post"] as const,
	deleteFavorite: ["meetings", "favorite", "delete"] as const,
	postJoin: ["meetings", "join", "post"] as const,
	deleteJoin: ["meetings", "join", "delete"] as const,
};
