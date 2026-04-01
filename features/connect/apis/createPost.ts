import { clientFetch } from "@/libs/clientFetch";

interface CreatePostsParams {
	title: string;
	content: string;
	image?: string;
}

export async function createPost(data: CreatePostsParams) {
	const res = await clientFetch("/posts", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("게시글 생성 실패");
	}

	return res.json();
}
