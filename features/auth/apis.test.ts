import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { postLogin, postLogout, postSignUp, postOAuthLogin } from "@/features/auth/apis";

describe("auth apis 테스트", () => {
	describe("postLogin", () => {
		it("성공 시 응답 데이터를 반환한다", async () => {
			server.use(
				http.post("/api/auth/login", () =>
					HttpResponse.json(
						{
							user: { id: 1 },
							accessToken: "mock-access-token",
							refreshToken: "mock-refresh-token",
						},
						{ status: 200 },
					),
				),
			);
			const result = await postLogin({ email: "test@example.com", password: "password123" });
			expect(result).toMatchObject({
				user: { id: 1 },
				accessToken: "mock-access-token",
				refreshToken: "mock-refresh-token",
			});
		});

		it("실패 시 응답 메시지와 status가 설정된 에러를 throw한다", async () => {
			server.use(
				http.post("/api/auth/login", () =>
					HttpResponse.json(
						{ message: "이메일 또는 비밀번호가 올바르지 않습니다." },
						{ status: 401 },
					),
				),
			);
			await expect(
				postLogin({ email: "test@example.com", password: "wrong" }),
			).rejects.toMatchObject({
				message: "이메일 또는 비밀번호가 올바르지 않습니다.",
				status: 401,
			});
		});

		it("실패 시 응답 바디가 없으면 기본 에러 메시지를 throw한다", async () => {
			server.use(http.post("/api/auth/login", () => new HttpResponse(null, { status: 500 })));
			await expect(
				postLogin({ email: "test@example.com", password: "wrong" }),
			).rejects.toMatchObject({
				message: "오류가 발생했습니다.",
				status: 500,
			});
		});
	});

	describe("postSignUp", () => {
		it("성공 시 응답 데이터를 반환한다", async () => {
			server.use(
				http.post("/api/auth/signup", () =>
					HttpResponse.json({ id: 1, email: "test@example.com", name: "홍길동" }, { status: 201 }),
				),
			);

			const result = await postSignUp({
				email: "test@example.com",
				password: "password123",
				name: "홍길동",
			});

			expect(result).toMatchObject({
				id: 1,
				email: "test@example.com",
				name: "홍길동",
			});
		});

		it("실패 시 응답 메시지와 status가 설정된 에러를 throw한다", async () => {
			server.use(
				http.post("/api/auth/signup", () =>
					HttpResponse.json({ message: "이미 존재하는 이메일 입니다." }, { status: 409 }),
				),
			);
			await expect(
				postSignUp({ email: "test@example.com", password: "password123", name: "홍길동" }),
			).rejects.toMatchObject({
				message: "이미 존재하는 이메일 입니다.",
				status: 409,
			});
		});

		it("실패 시 응답 바디가 없으면 기본 에러 메시지를 throw한다", async () => {
			server.use(http.post("/api/auth/signup", () => new HttpResponse(null, { status: 500 })));
			await expect(
				postSignUp({ email: "test@example.com", password: "password123", name: "홍길동" }),
			).rejects.toMatchObject({
				message: "오류가 발생했습니다.",
				status: 500,
			});
		});
	});
	describe("postLogout", () => {
		it("성공 시 응답을 반환한다", async () => {
			server.use(http.post("/api/auth/logout", () => new HttpResponse(null, { status: 204 })));
			const result = await postLogout();
			expect(result.status).toBe(204);
		});
	});
	describe("postOAuthLogin", () => {
		it("성공 시 응답 데이터를 반환한다", async () => {
			server.use(
				http.post("/api/auth/oauth/google", () =>
					HttpResponse.json(
						{
							user: { id: 1 },
							accessToken: "mock-access-token",
							refreshToken: "mock-refresh-token",
						},
						{ status: 200 },
					),
				),
			);
			const result = await postOAuthLogin("google", "mock-token");
			expect(result).toMatchObject({
				user: { id: 1 },
				accessToken: "mock-access-token",
				refreshToken: "mock-refresh-token",
			});
		});

		it("실패 시 응답 메시지와 status가 설정된 에러를 throw한다", async () => {
			server.use(
				http.post("/api/auth/oauth/google", () =>
					HttpResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 401 }),
				),
			);
			await expect(postOAuthLogin("google", "invalid-token")).rejects.toMatchObject({
				message: "유효하지 않은 토큰입니다.",
				status: 401,
			});
		});

		it("409 - 이미 다른 방식으로 가입된 이메일이면 에러를 throw한다", async () => {
			server.use(
				http.post("/api/auth/oauth/google", () =>
					HttpResponse.json(
						{ message: "이미 다른 방식으로 가입된 이메일입니다." },
						{ status: 409 },
					),
				),
			);
			await expect(postOAuthLogin("google", "mock-token")).rejects.toMatchObject({
				message: "이미 다른 방식으로 가입된 이메일입니다.",
				status: 409,
			});
		});
	});
});
