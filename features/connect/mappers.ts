import type { Post } from "./types";

export function mapPostToCard(post: Post) {
	return {
		id: post.id,
		title: post.title,
		description: post.content,
		imageUrl: post.image,
		author: post.author.name,
		date: new Date(post.createdAt).getTime(),
		likeCount: post.likeCount,
		commentCount: post._count.comments,
	};
}
