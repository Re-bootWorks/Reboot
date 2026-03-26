const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPostDetail = async (id: number) => {
	const res = await fetch(`${BASE_URL}/posts/${id}`);

	if (!res.ok) throw new Error("게시글 상세 조회 실패");

	return res.json();
};
