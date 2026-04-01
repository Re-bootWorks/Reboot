"use client";

import { useRef } from "react";
import { IcDelete } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import { CloseButton } from "@headlessui/react";
import { NotificationCardItem } from "../../types";
import { useGetNotifications } from "../../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import {
	useDeleteNotifications,
	useDeleteNotificationsAll,
	usePutNotificationsRead,
	usePutNotificationsReadAll,
} from "../../mutations";
import NotificationCard from "../NotificationCard";

const PANEL_STYLE = {
	title: "flex items-center justify-between px-6 text-base font-semibold",
	notificationList: "scrollbar overflow-y-auto md:max-h-90",
	empty: "px-6 py-14 text-center text-sm text-gray-500",
	textButton: "py-1 text-xs font-semibold",
};

interface NotificationPanelProps {
	unreadCount: number;
	close: () => void;
}

export default function NotificationPanel({ close, unreadCount }: NotificationPanelProps) {
	const router = useRouter();
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

	// 무한스크롤 적용
	const listRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		rootRef: listRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
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
	const { mutate: deleteNotifications } = useDeleteNotifications();
	function handleDeleteClick(notificationId: number) {
		deleteNotifications({ notificationId });
	}

	// 알람 전체 삭제
	const { mutate: deleteNotificationsAll, isPending: isAllDeletePending } =
		useDeleteNotificationsAll();

	function handleDeleteAllClick() {
		deleteNotificationsAll();
	}
	return (
		<>
			<h3 className={PANEL_STYLE.title}>
				알림 내역
				<CloseButton aria-label="알림 내역 닫기" className="cursor-pointer">
					<IcDelete />
				</CloseButton>
			</h3>

			{isPending ? (
				<Loading size="md" />
			) : isEmpty ? (
				<div className={PANEL_STYLE.empty}>아직 알림이 없어요</div>
			) : (
				<>
					<div ref={listRef} className={PANEL_STYLE.notificationList}>
						{items.map((item) => (
							<NotificationCard
								key={item.id}
								item={item}
								type={item.type}
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
						{isFetchingNextPage && <Loading size="md" className="pt-0" />}
						<div className="flex justify-end gap-4 px-6">
							{!isEmpty && (
								<button
									disabled={isAllDeletePending}
									className={cn(PANEL_STYLE.textButton, "text-error cursor-pointer")}
									onClick={handleDeleteAllClick}>
									알림 전체 삭제
								</button>
							)}
							<button
								disabled={unreadCount === 0 || isAllReadPending}
								className={cn(
									unreadCount > 0 ? "cursor-pointer text-purple-500" : "text-gray-400",
									PANEL_STYLE.textButton,
								)}
								onClick={handleReadAllClick}>
								모두 읽기
							</button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
