import { clientFetch } from "@/libs/clientFetch";

export async function updateComment({
	postId,
	commentId,
	content,
}: {
	postId: number;
	commentId: number;
	content: string;
}): Promise<void> {
	const res = await clientFetch(`/posts/${postId}/comments/${commentId}`, {
		method: "PATCH",
		body: JSON.stringify({ content }),
	});

	if (!res.ok) {
		throw new Error("댓글 수정 실패");
	}
}
