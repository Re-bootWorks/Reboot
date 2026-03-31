import { clientFetch } from "@/libs/clientFetch";
import {
	FavoritesCount,
	NotificationCardItem,
	NotificationCardList,
	NotificationRes,
	CursorPageResponse,
} from "./types";

//@TODO 공통 기능 merge시 삭제
interface ErrorResponse {
	code?: string;
	message?: string;
}
async function throwApiError(response: Response, fallbackMessage: string): Promise<void> {
	if (response.ok) return;

	const error: ErrorResponse = await response.json().catch(() => ({
		message: fallbackMessage,
	}));

	throw new Error(error.message ?? fallbackMessage);
}

// 알림 목록 mapper
function mapNotifications(item: NotificationRes): NotificationCardItem {
	switch (item.type) {
		case "MEETING_CONFIRMED":
		case "MEETING_CANCELED":
			return {
				id: item.id,
				type: item.type,
				message: item.message,
				image: item.data.image,
				meetingId: item.data.meetingId,
				meetingName: item.data.meetingName,
				isRead: item.isRead,
				createdAt: item.createdAt,
			};

		case "COMMENT":
			return {
				id: item.id,
				type: item.type,
				message: item.message,
				image: item.data.image,
				postId: item.data.postId,
				postTitle: item.data.postTitle,
				commentId: item.data.commentId,
				isRead: item.isRead,
				createdAt: item.createdAt,
			};
	}
}

// GNB 찜한 모임 개수
export async function getFavoritesCount(): Promise<FavoritesCount> {
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
