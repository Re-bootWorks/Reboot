import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import { useSuspenseQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserProfile } from "@/apis/UserProfile";

export const connectQueryKeys = {
	posts: (page: number, sortBy: string, limit: number, keyword: string) =>
		["posts", page, sortBy, limit, keyword] as const,
	hotPosts: () => ["hotPosts"] as const,
	postDetail: (postId: number) => ["postDetail", postId] as const,
};

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
		queryKey: connectQueryKeys.posts(page, sortBy, limit, keyword),
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

export function useGetHotPosts() {
	return useSuspenseQuery({
		queryKey: connectQueryKeys.hotPosts(),
		queryFn: () => fetchPostsClient({ type: "best", limit: 20 }),
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
}

export function useGetPostDetail(postId: number) {
	return useQuery({
		queryKey: connectQueryKeys.postDetail(postId),
		queryFn: () => getPostDetailClient(postId),
	});
}

// 유저 프로필 조회 쿼리
export function useGetUserProfile(userId: number | null) {
	return useQuery({
		queryKey: ["user", "profile", userId],
		queryFn: () => getUserProfile(userId!),
		enabled: !!userId,
	});
}
