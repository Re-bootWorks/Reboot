const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
}

// 게시글 목록 조회 함수 (서버에서 실행)
export async function getPosts(page: number) {
	const size = 10;
	// 요청 쿼리 생성 (정렬 + 페이지네이션)
	const params = new URLSearchParams({
		type: "all",
		sortBy: "createdAt",
		sortOrder: "desc",
		size: String(size),
		offset: String((page - 1) * size),
	});
	// API 요청
	const res = await fetch(`${BASE_URL}/posts?${params}`, {
		cache: "no-store",
	});

	if (!res.ok) throw new Error("게시글 조회 실패");

	return res.json();
}
