import { clientFetch } from "@/libs/clientFetch";
import type { Post } from "@/features/connect/types";

type GetPostsParams = {
	type?: "all" | "best";
	sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount";
	offset?: number;
	limit?: number;
};

type GetPostsResponse = {
	data: Post[];
	total: number;
};

// 클라이언트용 fetch
export const fetchPostsClient = async (params: GetPostsParams): Promise<GetPostsResponse> => {
	const query = new URLSearchParams({
		type: params.type ?? "all",
		sortBy: params.sortBy ?? "createdAt",
		offset: String(params.offset ?? 0),
		limit: String(params.limit ?? 10),
	});

	const res = await clientFetch(`/posts?${query}`);

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
};
