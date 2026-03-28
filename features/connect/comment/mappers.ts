import type { Comment, CommentCardItem } from "./types";

export function mapCommentToCard(comment: Comment): CommentCardItem {
	return {
		id: comment.id,
		content: comment.content,
		authorName: comment.author.name,
		date: new Date(comment.createdAt).getTime(),
		likeCount: comment.likeCount,
	};
}
