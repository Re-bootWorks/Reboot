import { clientFetch } from "@/libs/clientFetch";

export async function deletePost(id: number) {
	const res = await clientFetch(`/posts/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("삭제 실패");

	return res.json();
}
