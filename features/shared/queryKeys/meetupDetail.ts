const MEETUP_DETAIL_QUERY_BASE_KEY = ["meetupDetail"] as const;

export const meetupDetailQueryKeys = {
	all: MEETUP_DETAIL_QUERY_BASE_KEY,

	meeting: {
		all: [...MEETUP_DETAIL_QUERY_BASE_KEY, "meeting"] as const,
		detail: (meetingId: number) => [...MEETUP_DETAIL_QUERY_BASE_KEY, "meeting", meetingId] as const,
	},

	participants: {
		all: [...MEETUP_DETAIL_QUERY_BASE_KEY, "participants"] as const,
		detail: (meetingId: number) =>
			[...MEETUP_DETAIL_QUERY_BASE_KEY, "participants", meetingId] as const,
	},

	reviews: {
		all: [...MEETUP_DETAIL_QUERY_BASE_KEY, "reviews"] as const,
		detail: (meetingId: number, cursor?: string) =>
			[...MEETUP_DETAIL_QUERY_BASE_KEY, "reviews", meetingId, cursor] as const,
	},

	related: {
		all: [...MEETUP_DETAIL_QUERY_BASE_KEY, "related"] as const,
		detail: (meetingId: number, region: string, type: string) =>
			[...MEETUP_DETAIL_QUERY_BASE_KEY, "related", meetingId, region, type] as const,
	},
} as const;
