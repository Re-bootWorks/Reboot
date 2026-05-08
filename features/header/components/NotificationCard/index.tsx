import { IcCheckCircle, IcDelete } from "@/components/ui/icons";
import { NotificationCardItem } from "../../types";
import { cn } from "@/utils/cn";
import Thumbnail from "@/components/ui/Thumbnail";
import RelativeTime from "@/components/ui/RelativeTime";

const NOTIFICATION_STYLE = {
	card: "block w-full cursor-pointer px-5 py-3 text-left hover:bg-purple-50",
	cardContent: "flex items-start gap-4",
	cardDot: "size-1 shrink-0 rounded-full bg-linear-to-r from-purple-400 to-purple-700",
	cardType: "flex items-center text-xs font-semibold text-gray-800",
	cardDeleteBtn:
		"absolute top-3 right-5 z-1 flex size-4 cursor-pointer items-center justify-center rounded-full bg-gray-700",
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

	return (
		<article className="relative">
			<button
				type="button"
				aria-label={item.isRead ? "읽은 알림" : "읽지 않은 알림"}
				className={cn(NOTIFICATION_STYLE.card, !item.isRead && "bg-purple-50/30")}
				onClick={handleReadAction}>
				<div className={NOTIFICATION_STYLE.cardContent}>
					<Thumbnail
						src={item.image}
						width={40}
						height={40}
						className={cn(!!item.image && "border border-gray-200", "size-10 shrink-0 rounded-lg")}
					/>
					<div className="grow">
						<span className={cn(NOTIFICATION_STYLE.cardType)}>
							{typeUi.label}
							{typeUi.icon}
						</span>
						<p className={NOTIFICATION_STYLE.cardMessage}>{item.message}</p>
						<div className={NOTIFICATION_STYLE.cardDate}>
							{!item.isRead && (
								<span
									className={NOTIFICATION_STYLE.cardDot}
									aria-hidden="true"
									data-testid="unread-indicator"
								/>
							)}
							<RelativeTime date={item.createdAt} />
						</div>
					</div>
				</div>
			</button>

			<button
				type="button"
				className={NOTIFICATION_STYLE.cardDeleteBtn}
				onClick={handleDeleteAction}
				aria-label="알림 삭제">
				<IcDelete color="white" size="10px" />
			</button>
		</article>
	);
}
