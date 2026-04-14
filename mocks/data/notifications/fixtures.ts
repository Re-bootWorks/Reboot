import type { NotificationRes } from "@/features/header/types";
import { TEAM_ID } from "../../constants";

export const NOTIFICATIONS: NotificationRes[] = [
	{
		id: 1,
		teamId: TEAM_ID,
		userId: 1,
		type: "MEETING_CONFIRMED",
		message: "'모임 이름' 모임이 개설 확정되었습니다.",
		data: {
			image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=480&fit=crop",
			meetingId: 1,
			meetingName: "모임 이름",
		},
		isRead: false,
		createdAt: "2026-03-10T09:00:00.000Z",
	},
	{
		id: 2,
		teamId: TEAM_ID,
		userId: 1,
		type: "COMMENT",
		message: "김철수님이 '달램핏 후기' 게시글에 댓글을 남겼습니다.",
		data: { image: null, postId: 1, postTitle: "달램핏 후기", commentId: 1 },
		isRead: false,
		createdAt: "2026-03-09T15:00:00.000Z",
	},
	{
		id: 3,
		teamId: TEAM_ID,
		userId: 1,
		type: "MEETING_CANCELED",
		message: "'취소된 모임' 모임이 취소되었습니다.",
		data: { image: null, meetingId: 3, meetingName: "취소된 모임" },
		isRead: true,
		createdAt: "2026-03-08T12:00:00.000Z",
	},
];
