export interface UserProfile {
	id: number;
	email: string;
	name: string;
	image: string | null;
}

export type TabId = "meetup" | "review" | "created";

export interface MeetupItem {
	id: number;
	name: string;
	region: string;
	dateTime: string;
	registrationEnd: string;
	capacity: number;
	participantCount: number;
	image: string | null;
	canceledAt: string | null;
	confirmedAt: string | null;
	hostId: number;
	isFavorited: boolean;
	isReviewed: boolean;
	isCompleted: boolean;
}

export type MeetupList = MeetupItem[];
