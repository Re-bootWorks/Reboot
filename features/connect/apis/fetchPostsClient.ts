import { clientFetch } from "@/libs/clientFetch";
import type { Post } from "@/features/connect/post/types";

type GetPostsParams = {
	type?: "all" | "best";
	sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount";
	cursor?: string;
	size?: number;
};

type GetPostsResponse = {
	data: Post[];
	nextCursor: string | null;
	hasMore: boolean;
};

// 클라이언트용 fetch
export const fetchPostsClient = async (params: GetPostsParams): Promise<GetPostsResponse> => {
	const query = new URLSearchParams({
		type: params.type ?? "all",
		sortBy: params.sortBy ?? "createdAt",
		size: String(params.size ?? 10),
		...(params.cursor ? { cursor: params.cursor } : {}),
	});

	const res = await clientFetch(`/posts?${query}`);
	if (!res.ok) throw new Error("게시글 조회 실패");
	return res.json();
};

// 클라이언트용 좋아요 토글
export const toggleConnectLike = async (postId: string): Promise<void> => {
	const res = await clientFetch(`/posts/${postId}/like`, {
		method: "POST",
	});

	if (!res.ok) {
		throw new Error("좋아요 요청 실패");
	}
};

// 클라이언트용 좋아요 취소
export const deleteConnectLike = async (postId: string): Promise<void> => {
	const res = await clientFetch(`/posts/${postId}/like`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("좋아요 취소 실패");
	}
};
