import type { GetPostsResponse, ConnectPost } from "@/features/connect/post/types";
import type { Comment, GetCommentsResponse } from "@/features/connect/comment/types";
import { TEAM_ID } from "../../constants";
import { POSTS, COMMENTS } from "./fixtures";

function getPosts(): GetPostsResponse {
	return {
		data: POSTS,
		nextCursor: undefined,
		hasMore: false,
		totalCount: POSTS.length,
		currentOffset: 0,
		limit: 10,
		totalViewCount: POSTS.reduce((sum, p) => sum + p.viewCount, 0),
	};
}

function getPostById(postId: number): ConnectPost | undefined {
	const post = POSTS.find((p) => p.id === postId);
	if (post) {
		post.comments = COMMENTS.filter((c) => c.postId === postId);
	}
	return post;
}

function createPost(body: { title: string; content: string; image?: string }) {
	const newPost: ConnectPost = {
		id: POSTS.length + 1,
		teamId: TEAM_ID,
		title: body.title,
		content: body.content,
		image: body.image ?? "",
		authorId: 1,
		viewCount: 0,
		likeCount: 0,
		isLiked: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		author: {
			id: 1,
			name: "홍길동",
			image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
			email: "test@example.com",
		},
		_count: { comments: 0 },
		comments: [],
	};
	POSTS.unshift(newPost);
	return newPost;
}

function updatePost(
	postId: number,
	body: { title?: string; content?: string; image?: string | null },
) {
	const post = POSTS.find((p) => p.id === postId);
	if (!post) return undefined;
	if (body.title !== undefined) post.title = body.title;
	if (body.content !== undefined) post.content = body.content;
	if (body.image !== undefined) post.image = body.image ?? "";
	post.updatedAt = new Date().toISOString();
	return post;
}

function deletePost(postId: number) {
	const idx = POSTS.findIndex((p) => p.id === postId);
	if (idx >= 0) POSTS.splice(idx, 1);
	return idx >= 0;
}

function getComments(postId: number): GetCommentsResponse {
	const filtered = COMMENTS.filter((c) => c.postId === postId);
	return { data: filtered, nextCursor: null, hasMore: false };
}

function createComment(postId: number, body: { content: string }) {
	const newComment: Comment = {
		id: COMMENTS.length + 1,
		teamId: TEAM_ID,
		postId,
		authorId: 1,
		content: body.content,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		author: {
			id: 1,
			name: "홍길동",
			image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
		},
		likeCount: 0,
		isLiked: false,
	};
	COMMENTS.push(newComment);
	const post = POSTS.find((p) => p.id === postId);
	if (post) post._count.comments += 1;
	return newComment;
}

function updateComment(commentId: number, body: { content: string }) {
	const comment = COMMENTS.find((c) => c.id === commentId);
	if (!comment) return undefined;
	comment.content = body.content;
	comment.updatedAt = new Date().toISOString();
	return comment;
}

function deleteComment(postId: number, commentId: number) {
	const idx = COMMENTS.findIndex((c) => c.id === commentId);
	if (idx >= 0) {
		COMMENTS.splice(idx, 1);
		const post = POSTS.find((p) => p.id === postId);
		if (post) post._count.comments = Math.max(0, post._count.comments - 1);
	}
	return idx >= 0;
}

export default {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	getComments,
	createComment,
	updateComment,
	deleteComment,
};
