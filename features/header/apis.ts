import { clientFetch } from "@/libs/clientFetch";
import {
	GNBCount,
	NotificationCardItem,
	NotificationCardList,
	NotificationRes,
	CursorPageResponse,
} from "./types";
import { throwApiError } from "@/utils/api";

// 알림 목록 mapper
function mapNotifications(item: NotificationRes): NotificationCardItem {
	const base = {
		id: item.id,
		type: item.type,
		message: item.message,
		image: item.data.image,
		isRead: item.isRead,
		createdAt: item.createdAt,
	};

	switch (item.type) {
		case "MEETING_CONFIRMED":
		case "MEETING_CANCELED":
			return {
				...base,
				meetingId: item.data.meetingId,
				meetingName: item.data.meetingName,
			};

		case "COMMENT":
			return {
				...base,
				postId: item.data.postId,
				postTitle: item.data.postTitle,
				commentId: item.data.commentId,
			};

		default:
			return base;
	}
}

// GNB 찜한 모임 개수
export async function getFavoritesCount(): Promise<GNBCount> {
	const res = await clientFetch("/favorites/count");

	await throwApiError(res, "찜 개수 조회에 실패했습니다.");
	return res.json();
}

// 알림 목록
export async function getNotifications(
	cursor?: string,
): Promise<CursorPageResponse<NotificationCardList>> {
	const endpoint = cursor ? `/notifications?cursor=${cursor}` : "/notifications";
	const res = await clientFetch(endpoint);

	await throwApiError(res, "알림 목록 조회에 실패했습니다.");

	const json = await res.json();

	return {
		...json,
		data: json.data.map(mapNotifications),
	};
}

// 읽지 않은 알림 수 조회
export async function getNotificationUnreadCount(): Promise<GNBCount> {
	const res = await clientFetch("/notifications/unread-count");

	await throwApiError(res, "읽지 않은 알림 개수 조회에 실패했습니다.");
	return res.json();
}

// 전체 알림 삭제
export async function deleteNotificationsAll(): Promise<void> {
	const res = await clientFetch(`/notifications`, {
		method: "DELETE",
	});
	await throwApiError(res, "전체 알림 삭제에 실패했습니다.");
}

// 모든 알림 읽음 처리
export async function putNotificationsReadAll(): Promise<void> {
	const res = await clientFetch(`/notifications/read-all`, {
		method: "PUT",
	});

	await throwApiError(res, "전체 알림 읽음 처리에 실패했습니다.");
}

// 개별 알림 읽음 처리
export async function putNotificationsRead({
	notificationId,
}: {
	notificationId: number;
}): Promise<void> {
	const res = await clientFetch(`/notifications/${notificationId}/read`, {
		method: "PUT",
	});

	await throwApiError(res, "알림 읽음 처리에 실패했습니다.");
}

// 개별 알림 삭제
export async function deleteNotifications({
	notificationId,
}: {
	notificationId: number;
}): Promise<void> {
	const res = await clientFetch(`/notifications/${notificationId}`, {
		method: "DELETE",
	});

	await throwApiError(res, "알림 삭제에 실패했습니다.");
}
