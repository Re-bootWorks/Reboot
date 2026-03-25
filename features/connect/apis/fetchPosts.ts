const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

export const fetchPosts = async (page: number) => {
	const size = 10;

	const params = new URLSearchParams({
		type: "all",
		sortBy: "createdAt",
		sortOrder: "desc",
		size: String(size),
		offset: String((page - 1) * size),
	});

	const res = await fetch(`${BASE_URL}/posts?${params}`, {
		// credentials: "include", 로그인추가시 활성화
	});

	if (!res.ok) {
		throw new Error("게시글 조회 실패");
	}

	return res.json();
};
