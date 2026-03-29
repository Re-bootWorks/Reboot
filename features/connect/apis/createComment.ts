import { clientFetch } from "@/libs/clientFetch";

export async function createComment({ postId, content }: { postId: number; content: string }) {
	const res = await clientFetch(`/posts/${postId}/comments`, {
		method: "POST",
		body: JSON.stringify({ content }),
	});

	if (!res.ok) {
		throw new Error("댓글 생성 실패");
	}

	return res.json();
}
