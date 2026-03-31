import { clientFetch } from "@/libs/clientFetch";
import type { GetPostsParams, GetPostsResponse } from "@/features/connect/post/types";

// 클라이언트용 fetch
export const fetchPostsClient = async (params: GetPostsParams): Promise<GetPostsResponse> => {
	const query = new URLSearchParams({
		type: params.type ?? "all",
		sortBy: params.sortBy ?? "createdAt",
		offset: String(params.offset ?? 0),
		limit: String(params.limit ?? 5),
		...(params.keyword ? { keyword: params.keyword } : {}),
	});

	const res = await clientFetch(`/posts?${query}`);

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
};

// 좋아요 추가
export const toggleConnectLike = async (postId: number) => {
	const res = await clientFetch(`/posts/${postId}/like`, {
		method: "POST",
	});

	if (!res.ok) {
		throw new Error("좋아요 요청 실패");
	}
};

// 좋아요 취소
export const deleteConnectLike = async (postId: number) => {
	const res = await clientFetch(`/posts/${postId}/like`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("좋아요 취소 실패");
	}
};
