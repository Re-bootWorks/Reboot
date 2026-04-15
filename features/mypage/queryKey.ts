import { BaseListParams, GetMeetingsJoinedParams, GetUsersMeMeetingsParams } from "./apis";

/**
 *
 * 해당 파일은 현재 사용되지 않으며
 * 팀 전체 queryKeys 통합을 위해 선언된 파일입니다.
 * 추후 선언 및 import 경로를 변경합니다.
 * 임의로 mypage 와 header 를 동일파일에 작성합니다.
 *
 * 모임참여,참여취소 등 모임참여 관련한 경우 = meetup.joined
 * 모임생성,모임변경,모임확정,모임취소,모임삭제 등 모임주최 관련한 경우 = meetup.create
 * 모임관련해서 나누지않고 meetup.all 도 가능
 * 리뷰 생성,수정,삭제 등 리뷰 관련한경우 = review.all
 */

const MYPAGE_QUERY_BASE_KEY = ["mypage"] as const;
export const mypageQueryKeys = {
	all: MYPAGE_QUERY_BASE_KEY,
	meetups: {
		all: [...MYPAGE_QUERY_BASE_KEY, "meetups"] as const,
		// 참여한 모임 목록
		joined: [...MYPAGE_QUERY_BASE_KEY, "meetups", "joined"] as const,
		joinedList: (params: GetUsersMeMeetingsParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "meetups", "joined", params] as const,
		// 만든 모임 목록
		created: [...MYPAGE_QUERY_BASE_KEY, "meetups", "created"] as const,
		createdList: (params: GetUsersMeMeetingsParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "meetups", "created", params] as const,
	},

	reviews: {
		// 작성 가능한 리뷰 목록 (참여한 모든 목록)
		all: [...MYPAGE_QUERY_BASE_KEY, "reviews"] as const,
		available: [...MYPAGE_QUERY_BASE_KEY, "reviews", "available"] as const,
		availableList: (params: GetMeetingsJoinedParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "reviews", "available", params] as const,
		// 작성한 리뷰 목록
		written: [...MYPAGE_QUERY_BASE_KEY, "reviews", "written"] as const,
		writtenList: (params: BaseListParams = {}) =>
			[...MYPAGE_QUERY_BASE_KEY, "reviews", "written", params] as const,
	},
} as const;

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
