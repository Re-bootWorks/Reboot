/**
 * 찜 등록/해제 = favorites
 * 모임 삭제 (찜 갯수와 알림 모두 갱신) = all
 * 모임 참여, 참여취소,확정,취소,게시글 댓글 = notifications.all
 */
const HEADER_QUERY_BASE_KEY = ["header"] as const;
export const headerQueryKeys = {
	// 찜 개수
	all: HEADER_QUERY_BASE_KEY,
	favorites: [...HEADER_QUERY_BASE_KEY, "favorites"] as const,
	notifications: {
		all: [...HEADER_QUERY_BASE_KEY, "notifications"] as const,
		count: [...HEADER_QUERY_BASE_KEY, "notifications", "count"] as const,
	},
} as const;
