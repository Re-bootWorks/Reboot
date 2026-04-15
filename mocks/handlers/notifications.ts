import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import notifications from "../data/notifications";

export const notificationsHandlers = [
	// GET /api/notifications
	http.get(`${BASE_URL}/notifications`, () => {
		return HttpResponse.json(notifications.getNotifications());
	}),

	// DELETE /api/notifications (전체 삭제)
	http.delete(`${BASE_URL}/notifications`, () => {
		const result = notifications.deleteAll();
		return HttpResponse.json(result);
	}),

	// GET /api/notifications/unread-count
	http.get(`${BASE_URL}/notifications/unread-count`, () => {
		return HttpResponse.json(notifications.getUnreadCount());
	}),

	// PUT /api/notifications/read-all
	http.put(`${BASE_URL}/notifications/read-all`, () => {
		const result = notifications.readAll();
		return HttpResponse.json(result);
	}),

	// PUT /api/notifications/:notificationId/read
	http.put(`${BASE_URL}/notifications/:notificationId/read`, ({ params }) => {
		const notificationId = Number(params.notificationId);
		const notification = notifications.readNotification(notificationId);
		if (!notification)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "알림을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(notification);
	}),

	// DELETE /api/notifications/:notificationId
	http.delete(`${BASE_URL}/notifications/:notificationId`, ({ params }) => {
		const notificationId = Number(params.notificationId);
		const deleted = notifications.deleteNotification(notificationId);
		if (!deleted)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "알림을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "삭제 성공" });
	}),
];
