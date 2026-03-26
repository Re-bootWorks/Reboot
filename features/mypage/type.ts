import { DetailCardItem } from "./components/DetailCard/type";

export interface UserProfile {
	id: number;
	email: string;
	name: string;
	image: string | null;
}

export type TabId = "meetup" | "review" | "created";

export interface MeetupItem extends DetailCardItem {
	registrationEnd: string;
	canceledAt: string | null;
	confirmedAt: string | null;
	hostId: number;
	isReviewed: boolean;
	isCompleted: boolean;
}
export type MeetupList = MeetupItem[];

export type WritableReviewItem = DetailCardItem;
export type WritableReviewList = WritableReviewItem[];
export interface CreatedItem extends DetailCardItem {
	isCompleted: boolean;
	canceledAt: string | null;
	confirmedAt: string | null;
}
export type CreatedList = CreatedItem[];
