export interface DetailCardItem {
	id: number;
	name: string;
	region: string;
	dateTime: string;
	capacity: number;
	participantCount: number;
	image: string | null;
	isFavorited: boolean;
}
export interface DetailCardBadge {
	label: string;
	variant: "scheduled" | "confirmed" | "pending" | "completed" | "completedAlt";
	showStatusLabel?: boolean;
}

export interface DetailCardAction {
	label: string;
	variant?: "purple" | "purpleBorder" | "grayBorder";
	isDestructive?: boolean;
	handleCardButtonClick: () => void;
}
export interface DetailCardWishAction {
	isWished?: boolean;
	isPending?: boolean;
	handleWishClick: () => void;
}

export interface DetailCardProps {
	item: DetailCardItem;
	badges?: DetailCardBadge[];
	actions?: DetailCardAction[];
	wishAction?: DetailCardWishAction;
}
