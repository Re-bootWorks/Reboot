import { fetchPostsClient } from "@/features/connect/apis/fetchPostsClient";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";

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
	return useSuspenseQuery({
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
