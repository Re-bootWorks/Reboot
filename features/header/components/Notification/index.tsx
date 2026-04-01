"use client";

import { useRef, useState } from "react";
import { IcBellOutline, IcBellUnreadOutline, IcCheckCircle, IcDelete } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import {
	CloseButton,
	Popover,
	PopoverBackdrop,
	PopoverButton,
	PopoverPanel,
} from "@headlessui/react";
import { NotificationCardItem, NotificationType } from "../../types";
import { useGetNotifications } from "../../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import Thumbnail from "@/components/ui/Thumbnail";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import { useRouter } from "next/navigation";
import {
	useDeleteNotifications,
	useDeleteNotificationsAll,
	usePutNotificationsRead,
	usePutNotificationsReadAll,
} from "../../mutations";

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
	type: NotificationType;
	handleReadAction: () => void;
	handleDeleteAction: () => void;
	isPending?: boolean;
}
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
} as const;

function NotificationCard({
	item,
	type,
	handleReadAction,
	handleDeleteAction,
	isPending,
}: NotificationCardProps) {
	const typeUi = NOTIFICATION_TYPE_UI[type];

	function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		handleDeleteAction();
	}

	return (
		<button
			type="button"
			disabled={isPending}
			className={cn(NOTIFICATION_STYLE.card, !item.isRead && "bg-purple-50/30")}
			onClick={handleReadAction}>
			{isPending ? (
				<Loading size="sm" />
			) : (
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
			)}
		</button>
	);
}

const POPOVER_STYLE = {
	popoverButton: "cursor-pointer focus:outline-transparent",
	popoverBackdrop: "bg-black-50 fixed inset-0 md:bg-transparent",
	popoverPanel:
		"fixed inset-0 ml-auto flex h-full w-11/12 max-w-xl flex-col gap-4 rounded-l-3xl bg-white py-6 shadow-lg md:absolute md:top-[calc(100%+1rem)] md:-right-5 md:h-fit md:w-80 md:rounded-r-3xl",
	title: "flex items-center justify-between px-6 text-base font-semibold",
	notificationList: "scrollbar overflow-y-auto md:max-h-90",
	empty: "px-6 py-14 text-center text-sm text-gray-500",
	textButton: "py-1 text-xs font-semibold",
};
export default function Notification() {
	const router = useRouter();
	// 삭제될 항목의 타겟
	const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
	// 알람 목록
	const {
		data: notificationsData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
	} = useGetNotifications();

	const items = notificationsData?.pages.flatMap((page) => page.data) ?? [];
	const isEmpty = items.length === 0;
	const unreadCount = items.filter((item) => !item.isRead).length;

	// 무한스크롤 적용
	const listRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
		root: listRef.current,
		threshold: 1.0,
	});
	// 알람 개별 읽음
	const { mutate: putNotificationsRead } = usePutNotificationsRead();

	function handleNotificationClick(item: NotificationCardItem, popoverClose: () => void) {
		if (!item.isRead) {
			putNotificationsRead({ notificationId: item.id });
		}

		popoverClose();

		if (item.type === "COMMENT") {
			router.push(`/connect/${item.postId}`);
			return;
		}

		router.push(`/meetup/${item.meetingId}`);
	}

	// 알람 전체 읽음
	const { mutate: putNotificationsReadAll, isPending: isAllReadPending } =
		usePutNotificationsReadAll();
	function handleReadAllClick() {
		putNotificationsReadAll();
	}

	// 알람 개별 삭제
	const { mutateAsync: deleteNotifications } = useDeleteNotifications();
	async function handleDeleteClick(notificationId: number) {
		try {
			setDeleteTarget(notificationId);
			await deleteNotifications({ notificationId });
		} finally {
			setDeleteTarget(null);
		}
	}

	// 알람 전체 삭제
	const { mutate: deleteNotificationsAll, isPending: isAllDeletePending } =
		useDeleteNotificationsAll();

	function handleDeleteAllClick() {
		deleteNotificationsAll();
	}
	return (
		<Popover className="relative leading-0">
			<PopoverButton className={POPOVER_STYLE.popoverButton}>
				{unreadCount > 0 ? <IcBellUnreadOutline /> : <IcBellOutline />}
			</PopoverButton>

			<PopoverBackdrop className={POPOVER_STYLE.popoverBackdrop} />
			<PopoverPanel className={POPOVER_STYLE.popoverPanel}>
				{({ close }) => (
					<>
						<h3 className={POPOVER_STYLE.title}>
							알림 내역
							<CloseButton aria-label="알림 내역 닫기" className="cursor-pointer">
								<IcDelete />
							</CloseButton>
						</h3>

						{isPending ? (
							<Loading size="md" />
						) : isEmpty ? (
							<div className={POPOVER_STYLE.empty}>아직 알림이 없어요</div>
						) : (
							<>
								<div ref={listRef} className={POPOVER_STYLE.notificationList}>
									{items.map((item) => (
										<NotificationCard
											key={item.id}
											item={item}
											type={item.type}
											isPending={deleteTarget === item.id}
											handleReadAction={() => {
												handleNotificationClick(item, close);
											}}
											handleDeleteAction={() => {
												handleDeleteClick(item.id);
											}}
										/>
									))}
									<div ref={observerRef} className="h-4" />
								</div>
								<div>
									{isFetchingNextPage && <Loading size="md" />}
									<div className="flex justify-end gap-4 px-6">
										{!isEmpty && (
											<button
												disabled={isAllDeletePending}
												className={cn(POPOVER_STYLE.textButton, "text-error cursor-pointer")}
												onClick={handleDeleteAllClick}>
												알림 전체 삭제
											</button>
										)}
										<button
											disabled={unreadCount === 0 || isAllReadPending}
											className={cn(
												unreadCount > 0 ? "cursor-pointer text-purple-500" : "text-gray-400",
												POPOVER_STYLE.textButton,
											)}
											onClick={handleReadAllClick}>
											모두 읽기
										</button>
									</div>
								</div>
							</>
						)}
					</>
				)}
			</PopoverPanel>
		</Popover>
	);
}
