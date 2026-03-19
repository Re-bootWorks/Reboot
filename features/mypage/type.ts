export interface UserProfile {
	id: number;
	email: string;
	name: string;
	image: string | null;
}

export type TabId = "meetup" | "review" | "created";
