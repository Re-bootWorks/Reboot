import type { CursorPageResponse, NotificationRes } from "@/features/header/types";
import { NOTIFICATIONS } from "./fixtures";

function getNotifications(): CursorPageResponse<NotificationRes[]> {
	return { data: NOTIFICATIONS, nextCursor: null, hasMore: false };
}

function getUnreadCount() {
	return { count: NOTIFICATIONS.filter((n) => !n.isRead).length };
}

function readNotification(notificationId: number) {
	const notification = NOTIFICATIONS.find((n) => n.id === notificationId);
	if (notification) notification.isRead = true;
	return notification;
}

function readAll() {
	let count = 0;
	NOTIFICATIONS.forEach((n) => {
		if (!n.isRead) {
			n.isRead = true;
			count++;
		}
	});
	return { count };
}

function deleteNotification(notificationId: number) {
	const idx = NOTIFICATIONS.findIndex((n) => n.id === notificationId);
	if (idx >= 0) NOTIFICATIONS.splice(idx, 1);
	return idx >= 0;
}

function deleteAll() {
	const count = NOTIFICATIONS.length;
	NOTIFICATIONS.length = 0;
	return { count };
}

export default {
	getNotifications,
	getUnreadCount,
	readNotification,
	readAll,
	deleteNotification,
	deleteAll,
};
