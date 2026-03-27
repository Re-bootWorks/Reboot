import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./apis/fetchPostsClient.ts";
import { GetPostsParams } from "./types";

export function usePosts(params: GetPostsParams) {
	return useQuery({
		queryKey: ["posts", params], // 캐시 키
		queryFn: () => fetchPosts(params), // 실제 API 호출
	});
}
