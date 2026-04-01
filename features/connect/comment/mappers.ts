import type { CommentCardItem } from "./types";
import type { PostComment } from "@/features/connect/post/types";

export function mapCommentToCard(comment: PostComment): CommentCardItem {
	return {
		id: comment.id,
		content: comment.content,
		authorName: comment.author.name,
		date: new Date(comment.createdAt).getTime(),
	};
}
