import { MeetupItem } from "@/features/mypage/type";
export interface DetailCardBadge {
	label: string;
	variant: "scheduled" | "confirmed" | "pending" | "completed";
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
	item: MeetupItem;
	badges?: DetailCardBadge[];
	actions?: DetailCardAction[];
	wishAction?: DetailCardWishAction;
}
