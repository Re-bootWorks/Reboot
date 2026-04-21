import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { fetchPostsClient, toggleConnectLike, deleteConnectLike } from "./fetchPostsClient";
import { BASE_URL } from "@/mocks/constants";

// 각 테스트 전후 MSW 서버 생명주기 관리
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // 테스트마다 핸들러 초기화
afterAll(() => server.close());

describe("fetchPostsClient", () => {
	// 정상 흐름
	it("정상 응답 시 게시글 목록을 반환한다", async () => {
		const result = await fetchPostsClient({ type: "all", limit: 5 });
		expect(result.data).toBeDefined();
	});

	// 반환 타입 검증
	it("반환 데이터가 배열이다", async () => {
		const result = await fetchPostsClient({ type: "all", limit: 5 });
		expect(Array.isArray(result.data)).toBe(true);
	});

	// type 파라미터 동작 검증
	it("type=best로 HOT 게시글을 조회할 수 있다", async () => {
		const result = await fetchPostsClient({ type: "best", limit: 20 });
		expect(result.data).toBeDefined();
	});

	// keyword 파라미터 동작 검증
	it("keyword 파라미터를 포함해 요청할 수 있다", async () => {
		const result = await fetchPostsClient({ type: "all", keyword: "달램핏" });
		expect(result.data).toBeDefined();
	});

	// 500 에러 → throw 검증
	it("서버 에러 시 에러를 throw한다", async () => {
		server.use(http.get(`${BASE_URL}/posts`, () => HttpResponse.json({}, { status: 500 })));
		await expect(fetchPostsClient({ type: "all" })).rejects.toThrow("게시글 조회 실패");
	});

	// 404 에러 → throw 검증
	it("404 응답 시 에러를 throw한다", async () => {
		server.use(http.get(`${BASE_URL}/posts`, () => HttpResponse.json({}, { status: 404 })));
		await expect(fetchPostsClient({ type: "all" })).rejects.toThrow("게시글 조회 실패");
	});
});

describe("toggleConnectLike", () => {
	// 정상 흐름
	it("정상 응답 시 에러 없이 완료된다", async () => {
		await expect(toggleConnectLike(1)).resolves.not.toThrow();
	});

	// 500 에러 → throw 검증
	it("서버 에러 시 에러를 throw한다", async () => {
		server.use(
			http.post(`${BASE_URL}/posts/:postId/like`, () => HttpResponse.json({}, { status: 500 })),
		);
		await expect(toggleConnectLike(1)).rejects.toThrow("좋아요 요청 실패");
	});

	// 존재하지 않는 게시글 → throw 검증
	it("존재하지 않는 게시글에 좋아요 시 에러를 throw한다", async () => {
		server.use(
			http.post(`${BASE_URL}/posts/:postId/like`, () => HttpResponse.json({}, { status: 404 })),
		);
		await expect(toggleConnectLike(9999)).rejects.toThrow("좋아요 요청 실패");
	});
});

describe("deleteConnectLike", () => {
	// 정상 흐름
	it("정상 응답 시 에러 없이 완료된다", async () => {
		await expect(deleteConnectLike(1)).resolves.not.toThrow();
	});

	// 500 에러 → throw 검증
	it("서버 에러 시 에러를 throw한다", async () => {
		server.use(
			http.delete(`${BASE_URL}/posts/:postId/like`, () => HttpResponse.json({}, { status: 500 })),
		);
		await expect(deleteConnectLike(1)).rejects.toThrow("좋아요 취소 실패");
	});

	// 존재하지 않는 게시글 → throw 검증
	it("존재하지 않는 게시글에 좋아요 취소 시 에러를 throw한다", async () => {
		server.use(
			http.delete(`${BASE_URL}/posts/:postId/like`, () => HttpResponse.json({}, { status: 404 })),
		);
		await expect(deleteConnectLike(9999)).rejects.toThrow("좋아요 취소 실패");
	});
});
