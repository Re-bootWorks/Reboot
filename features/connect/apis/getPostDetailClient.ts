import { clientFetch } from "@/libs/clientFetch";
import type { ConnectPost } from "@/features/connect/post/types";

export async function getPostDetailClient(id: number): Promise<ConnectPost> {
	const res = await clientFetch(`/posts/${id}`);

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
}
