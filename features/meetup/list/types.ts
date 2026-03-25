export interface Host {
	id: number;
	name: string;
	image: string;
}

export interface Meeting {
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
	isFavorited: boolean;
}

export interface MeetingListResponse {
	data: Meeting[];
	nextCursor: string;
	hasMore: boolean;
}
