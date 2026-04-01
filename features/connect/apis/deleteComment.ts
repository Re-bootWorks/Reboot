import { clientFetch } from "@/libs/clientFetch";

export async function deleteComment({ postId, commentId }: { postId: number; commentId: number }) {
	const res = await clientFetch(`/posts/${postId}/comments/${commentId}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("댓글 삭제 실패");

	return res.json();
}
