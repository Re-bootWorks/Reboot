import { serverFetch } from "@/libs/serverFetch";

// 서버용
export async function getPostDetailServer(id: string) {
	const res = await serverFetch(`/posts/${id}`);

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
}
