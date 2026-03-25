import type { ReviewScore } from "@/features/reviews/components/ReviewCard";

export type User = {
	id: number;
	name: string;
	image: string | null;
};

export type Host = {
	id: number;
	name: string;
	image: string | null;
};

export type Meeting = {
	id: number;
	teamId: string;
	name: string;
	type: string;
	region: string;
	address: string;
	latitude: number;
	longitude: number;
	dateTime: string;
	registrationEnd: string;
	capacity: number;
	participantCount: number;
	image: string;
	description: string;
	canceledAt: string | null;
	confirmedAt: string | null;
	hostId: number;
	createdBy: number;
	createdAt: string;
	updatedAt: string;
	host: Host;
};

export type Participant = {
	id: number;
	teamId: string;
	meetingId: number;
	userId: number;
	joinedAt: string;
	user: User;
};

export type Review = {
	id: number;
	teamId: string;
	meetingId: number;
	userId: number;
	score: ReviewScore;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user: User;
	meeting: {
		id: number;
		name: string;
		type: string;
		region: string;
		image: string;
		dateTime: string;
	};
};

export type ParticipantsResponse = {
	data: Participant[];
	nextCursor: string;
	hasMore: boolean;
};

export type ReviewsResponse = {
	data: Review[];
	nextCursor: string;
	hasMore: boolean;
};
