import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import { useSuspenseQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserProfile } from "@/apis/UserProfile";

export const connectQueryKeys = {
	// 게시글 관련 전체 키 (invalidateQueries 범위 제어용)
	all: () => ["connect"] as const,

	// 게시글 목록 관련 키
	lists: () => [...connectQueryKeys.all(), "list"] as const,

	// 게시글 목록 필터 조합 키
	list: (page: number, sortBy: string, limit: number, keyword: string) =>
		[...connectQueryKeys.lists(), { page, sortBy, limit, keyword }] as const,

	// 인기 게시글 키
	hotPosts: () => [...connectQueryKeys.all(), "hotPosts"] as const,

	// 게시글 상세 키
	detail: (postId: number) => [...connectQueryKeys.all(), "detail", postId] as const,

	// 유저 프로필 키
	userProfile: (userId: number) => ["user", "profile", userId] as const,
};

// 게시글 목록 조회 (페이지네이션 + 정렬 + 검색)
export function useGetPosts({
	page,
	sortBy,
	keyword,
	limit = 5,
}: {
	page: number;
	sortBy: "createdAt" | "likeCount" | "viewCount" | "commentCount";
	keyword: string;
	limit?: number;
}) {
	return useQuery({
		queryKey: connectQueryKeys.list(page, sortBy, limit, keyword),
		queryFn: () =>
			fetchPostsClient({
				type: "all",
				sortBy,
				keyword,
				offset: (page - 1) * limit,
				limit,
			}),
		staleTime: 1000 * 60,
		placeholderData: keepPreviousData,
	});
}

// 인기 게시글 목록 조회 (상위 20개, Suspense 기반)
export function useGetHotPosts() {
	return useSuspenseQuery({
		queryKey: connectQueryKeys.hotPosts(),
		queryFn: () => fetchPostsClient({ type: "best", limit: 20 }),
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
}

// 게시글 상세 조회
export function useGetPostDetail(postId: number) {
	return useQuery({
		queryKey: connectQueryKeys.detail(postId),
		queryFn: () => getPostDetailClient(postId),
		staleTime: 1000 * 60,
	});
}

// 유저 프로필 조회 (userId가 null이면 요청 skip)
export function useGetUserProfile(userId: number | null) {
	return useQuery({
		queryKey: connectQueryKeys.userProfile(userId!),
		queryFn: () => getUserProfile(userId!),
		enabled: !!userId,
	});
}
