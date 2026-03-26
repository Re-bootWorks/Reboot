import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./apis/fetchPosts";
import { GetPostsParams } from "./post/types";

export function usePosts(params: GetPostsParams) {
	return useQuery({
		queryKey: ["posts", params], // 캐시 키
		queryFn: () => fetchPosts(params), // 실제 API 호출
	});
}
