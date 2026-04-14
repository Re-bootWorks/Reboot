import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import posts from "../data/posts";

export const postsHandlers = [
	// GET /api/posts
	http.get(`${BASE_URL}/posts`, () => {
		return HttpResponse.json(posts.getPosts());
	}),

	// POST /api/posts
	http.post(`${BASE_URL}/posts`, async ({ request }) => {
		const body = (await request.json()) as { title: string; content: string; image?: string };
		const created = posts.createPost(body);
		return HttpResponse.json(created, { status: 201 });
	}),

	// GET /api/posts/:id
	http.get(`${BASE_URL}/posts/:id`, ({ params }) => {
		const postId = Number(params.id);
		const post = posts.getPostById(postId);
		if (!post)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(post);
	}),

	// PATCH /api/posts/:id
	http.patch(`${BASE_URL}/posts/:id`, async ({ params, request }) => {
		const postId = Number(params.id);
		const body = (await request.json()) as {
			title?: string;
			content?: string;
			image?: string | null;
		};
		const updated = posts.updatePost(postId, body);
		if (!updated)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(updated);
	}),

	// DELETE /api/posts/:id
	http.delete(`${BASE_URL}/posts/:id`, ({ params }) => {
		const postId = Number(params.id);
		const deleted = posts.deletePost(postId);
		if (!deleted)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "삭제 성공" });
	}),

	// GET /api/posts/:id/comments
	http.get(`${BASE_URL}/posts/:id/comments`, ({ params }) => {
		const postId = Number(params.id);
		return HttpResponse.json(posts.getComments(postId));
	}),

	// POST /api/posts/:id/comments
	http.post(`${BASE_URL}/posts/:id/comments`, async ({ params, request }) => {
		const postId = Number(params.id);
		const body = (await request.json()) as { content: string };
		const created = posts.createComment(postId, body);
		return HttpResponse.json(created, { status: 201 });
	}),

	// PATCH /api/posts/:id/comments/:commentId
	http.patch(`${BASE_URL}/posts/:id/comments/:commentId`, async ({ params, request }) => {
		const commentId = Number(params.commentId);
		const body = (await request.json()) as { content: string };
		const updated = posts.updateComment(commentId, body);
		if (!updated)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(updated);
	}),

	// DELETE /api/posts/:id/comments/:commentId
	http.delete(`${BASE_URL}/posts/:id/comments/:commentId`, ({ params }) => {
		const postId = Number(params.id);
		const commentId = Number(params.commentId);
		const deleted = posts.deleteComment(postId, commentId);
		if (!deleted)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "삭제 성공" });
	}),

	// POST /api/posts/:id/like
	http.post(`${BASE_URL}/posts/:id/like`, ({ params }) => {
		const postId = Number(params.id);
		const post = posts.getPostById(postId);
		if (!post)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		post.likeCount += 1;
		post.isLiked = true;
		return HttpResponse.json({ message: "좋아요 성공" }, { status: 201 });
	}),

	// DELETE /api/posts/:id/like
	http.delete(`${BASE_URL}/posts/:id/like`, ({ params }) => {
		const postId = Number(params.id);
		const post = posts.getPostById(postId);
		if (!post)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
				{ status: 404 },
			);
		post.likeCount = Math.max(0, post.likeCount - 1);
		post.isLiked = false;
		return HttpResponse.json({ message: "좋아요 취소 성공" });
	}),
];
