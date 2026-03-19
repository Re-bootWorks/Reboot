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

export interface DetailCardBadge {
	label: string;
	variant: "scheduled" | "confirmed" | "pending" | "completed";
	showStatusLabel?: boolean;
}

export interface DetailCardAction {
	label: string;
	variant?: "purple" | "purpleBorder" | "grayBorder";
	handleCardButtonClick: () => void;
}
export interface DetailCardWishAction {
	isWished?: boolean;
	isPending?: boolean;
	handleWishClick: () => void;
}

export interface DetailCardProps {
	item: MeetupItem;
	badges?: DetailCardBadge[];
	actions?: DetailCardAction[];
	wishAction?: DetailCardWishAction;
}
