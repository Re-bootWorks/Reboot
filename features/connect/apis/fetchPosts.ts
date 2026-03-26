const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

type GetPostsParams = {
	type?: "all" | "best";
	sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount";
	offset?: number;
	limit?: number;
};

export const fetchPosts = async (params: GetPostsParams) => {
	const query = new URLSearchParams({
		type: params.type ?? "all",
		sortBy: params.sortBy ?? "createdAt",
		offset: String(params.offset ?? 0),
		limit: String(params.limit ?? 10),
	});

	const res = await fetch(`${BASE_URL}/posts?${query}`);
	console.log(BASE_URL);
	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
};
