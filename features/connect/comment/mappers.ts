import type { CommentResponse, CommentCardItem } from "./types";

export function mapCommentToCard(comment: CommentResponse): CommentCardItem {
	return {
		id: comment.id,
		content: comment.content,
		authorName: comment.author.name,
		date: new Date(comment.createdAt).getTime(),
	};
}
