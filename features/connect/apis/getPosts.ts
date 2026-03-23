const BASE_URL = "https://together-dallaem-api.vercel.app";
const TEAM_ID = "lucky7";

// 게시글 목록 조회 함수 (서버에서 실행)
export async function getPosts(page: number) {
	const size = 10; // 페이지당 데이터 개수

	// 요청 쿼리 생성 (정렬 + 페이지네이션)
	const params = new URLSearchParams({
		type: "all",
		sortBy: "createdAt",
		sortOrder: "desc",
		size: String(size),
		offset: String((page - 1) * size),
	});

	// API 요청
	const res = await fetch(`${BASE_URL}/${TEAM_ID}/posts?${params}`, {
		cache: "no-store", // 항상 최신 데이터 요청
	});

	// 실패 시 에러 처리
	if (!res.ok) throw new Error("게시글 조회 실패");

	// 응답 데이터 반환
	return res.json();
}
