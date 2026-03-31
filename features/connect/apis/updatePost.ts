import { clientFetch } from "@/libs/clientFetch";

export async function updatePost(id: number, data: { title: string; content: string }) {
	const res = await clientFetch(`/posts/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error("수정 실패");

	return res.json();
}
