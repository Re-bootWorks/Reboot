import { ReviewScore } from "@/types/common";

export interface RatingSummaryProps {
	averageScore: number;
	totalReviews: number;
	oneStar: number;
	twoStars: number;
	threeStars: number;
	fourStars: number;
	fiveStars: number;
}

export interface ReviewCardProps {
	id: number;
	meetingId: number;
	meetingImage: string;
	score: ReviewScore;
	userImage: string | null;
	userName: string;
	createdAt: string;
	comment: string;
	meetingName: string;
	meetingType: string;
	userId: number;
}
