import { clientFetch } from "@/libs/clientFetch";
import type { GetPostsParams, GetPostsResponse } from "@/features/connect/post/types";

// 클라이언트용 fetch
export const fetchPostsClient = async (params: GetPostsParams): Promise<GetPostsResponse> => {
	const query = new URLSearchParams({
		type: params.type ?? "all",
		sortBy: params.sortBy ?? "createdAt",
		offset: String(params.offset ?? 0),
		limit: String(params.limit ?? 20),
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

// 댓글 좋아요 추가
export const toggleCommentLike = async (postId: number, commentId: number) => {
	const res = await clientFetch(`/posts/${postId}/comments/${commentId}/like`, {
		method: "POST",
	});

	if (!res.ok) {
		// 409: 이미 좋아요한 경우도 throw
		throw new Error("댓글 좋아요 요청 실패");
	}
};

// 댓글 좋아요 취소
export const deleteCommentLike = async (postId: number, commentId: number) => {
	const res = await clientFetch(`/posts/${postId}/comments/${commentId}/like`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("댓글 좋아요 취소 실패");
	}
};
