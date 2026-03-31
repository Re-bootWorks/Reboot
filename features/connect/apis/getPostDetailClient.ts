import { clientFetch } from "@/libs/clientFetch";

// 클라용
export async function getPostDetailClient(id: number) {
	const res = await clientFetch(`/posts/${id}`);

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
}
