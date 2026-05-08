const CONNECT_QUERY_BASE_KEY = ["connect"] as const;

export const connectQueryKeys = {
	// 게시글 관련 전체 키 (invalidateQueries 범위 제어용)
	all: CONNECT_QUERY_BASE_KEY,

	// 게시글 목록 관련 키
	lists: [...CONNECT_QUERY_BASE_KEY, "list"] as const,

	// 게시글 목록 필터 조합 키
	list: (page: number, sortBy: string, limit: number, keyword: string) =>
		[...CONNECT_QUERY_BASE_KEY, "list", { page, sortBy, limit, keyword }] as const,

	// 인기 게시글 키
	hotPosts: [...CONNECT_QUERY_BASE_KEY, "hotPosts"] as const,

	// 게시글 상세 키
	detail: (postId: number) => [...CONNECT_QUERY_BASE_KEY, "detail", postId] as const,

	// 유저 프로필 키
	userProfile: (userId: number) => ["user", "profile", userId] as const,
} as const;
