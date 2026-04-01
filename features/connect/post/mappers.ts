import type { Post } from "./types";

// 게시글 데이터를 카드 컴포넌트에 맞는 형태로 변환
function extractImage(content: string): string | null {
	const match = content.match(/<img[^>]+src="([^">]+)"/);
	return match ? match[1] : null;
}

// HTML 태그 제거 (예: description에서)
function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "");
}

export function mapPostToCard(post: Post) {
	return {
		id: post.id,
		title: post.title,
		description: stripHtml(post.content),
		imageUrl: post.image ?? extractImage(post.content) ?? null,
		author: post.author.name,
		date: new Date(post.createdAt).getTime(),
		likeCount: post.likeCount,
		commentCount: post._count.comments,
	};
}
