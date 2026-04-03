import { IcCheckCircle, IcDelete } from "@/components/ui/icons";
import { NotificationCardItem } from "../../types";
import { cn } from "@/utils/cn";
import Thumbnail from "@/components/ui/Thumbnail";
import RelativeTime from "@/features/connect/ui/RelativeTime";

const NOTIFICATION_STYLE = {
	card: "px-5 py-3 w-full block text-left hover:bg-purple-50 cursor-pointer",
	cardContent: "flex items-start gap-4",
	cardDot: "size-1 shrink-0 rounded-full bg-linear-to-r from-purple-400 to-purple-700",
	cardType: "flex items-center text-xs font-semibold text-gray-800",
	cardDeleteBtn: "flex size-4 cursor-pointer items-center justify-center rounded-full bg-gray-700",
	cardMessage: "pt-1 text-sm text-gray-600 break-keep",
	cardDate: "flex items-center justify-end gap-1 text-xs text-gray-400",
};
interface NotificationCardProps {
	item: NotificationCardItem;
	handleReadAction: () => void;
	handleDeleteAction: () => void;
}
const DEFAULT_NOTIFICATION_TYPE_UI = {
	label: "알림",
	icon: null,
} as const;

const NOTIFICATION_TYPE_UI = {
	COMMENT: {
		label: "새로운 댓글",
		icon: null,
	},
	MEETING_CONFIRMED: {
		label: "모임 확정",
		icon: <IcCheckCircle size="xs" />,
	},
	MEETING_CANCELED: {
		label: "모임 취소",
		icon: null,
	},
	MEETING_DELETED: {
		label: "모임 삭제",
		icon: null,
	},
} as const;

export default function NotificationCard({
	item,
	handleReadAction,
	handleDeleteAction,
}: NotificationCardProps) {
	const typeUi =
		NOTIFICATION_TYPE_UI[item.type as keyof typeof NOTIFICATION_TYPE_UI] ??
		DEFAULT_NOTIFICATION_TYPE_UI;
	// 알림 클릭 시
	function handleCardClick() {
		handleReadAction();
	}
	// 알림 키보드 활성화
	function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleReadAction();
		}
	}
	function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		handleDeleteAction();
	}

	return (
		<article
			role="button"
			className={cn(NOTIFICATION_STYLE.card, !item.isRead && "bg-purple-50/30")}
			onClick={handleCardClick}
			onKeyDown={handleKeyDown}>
			<div className={NOTIFICATION_STYLE.cardContent}>
				<Thumbnail
					src={item.image}
					width={40}
					height={40}
					className={cn(
						!!item.image ? "border border-gray-200" : "",
						"size-10 shrink-0 rounded-lg",
					)}
				/>
				<div className="grow">
					<div className="flex items-center justify-between">
						<span className={cn(NOTIFICATION_STYLE.cardType)}>
							{typeUi.label}
							{typeUi.icon}
						</span>
						<button
							type="button"
							className={NOTIFICATION_STYLE.cardDeleteBtn}
							onClick={handleDeleteClick}>
							<IcDelete color="white" size="10px" />
						</button>
					</div>
					<p className={NOTIFICATION_STYLE.cardMessage}>{item.message}</p>
					<div className={NOTIFICATION_STYLE.cardDate}>
						{!item.isRead && <span className={NOTIFICATION_STYLE.cardDot} aria-hidden="true" />}
						<RelativeTime date={item.createdAt} />
					</div>
				</div>
			</div>
		</article>
	);
}
