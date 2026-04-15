import type { CommentCardItem } from "./types";
import type { PostComment } from "@/features/connect/post/types";

export function mapCommentToCard(comment: PostComment): CommentCardItem {
	return {
		id: comment.id,
		content: comment.content,
		authorName: comment.author.name,
		authorImage: comment.author.image,
		date: new Date(comment.createdAt).getTime(),
		likeCount: comment.likeCount ?? 0,
		isLiked: comment.isLiked ?? false,
	};
}
