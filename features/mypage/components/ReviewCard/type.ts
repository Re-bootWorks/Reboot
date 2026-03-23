import { UserProfile } from "@/features/mypage/type";

export interface ReviewCardItem {
	id: number;
	score: ReviewScore;
	comment: string;
	meetingId: number;
	meeting: {
		id: number;
		type: string;
		name: string;
		image: string | null;
	};
	dateTime: string;
}
export interface ReviewCardProps {
	user: UserProfile;
	item: ReviewCardItem;
	handleEdit: () => void;
	handleDelete: () => void;
}

export type ReviewList = ReviewCardItem[];

export type ReviewScore = 1 | 2 | 3 | 4 | 5;
