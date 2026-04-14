import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import auth from "../data/auth";

export const authHandlers = [
	// POST /api/auth/login
	http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
		const body = (await request.json()) as { email: string; password: string };
		const result = auth.login(body.email, body.password);
		if (!result.ok) return HttpResponse.json(result.error, { status: 401 });
		return HttpResponse.json(result.data, { status: 200 });
	}),

	// POST /api/auth/signup
	http.post(`${BASE_URL}/auth/signup`, async ({ request }) => {
		const body = (await request.json()) as {
			email: string;
			password: string;
			name: string;
			companyName?: string;
		};
		const result = auth.signup(body);
		if (!result.ok) return HttpResponse.json(result.error, { status: 400 });
		return HttpResponse.json(result.data, { status: 201 });
	}),

	// POST /api/auth/logout
	http.post(`${BASE_URL}/auth/logout`, () => {
		return new HttpResponse(null, { status: 204 });
	}),

	// POST /api/auth/socialLogin
	http.post(`${BASE_URL}/auth/socialLogin`, () => {
		return HttpResponse.json({ message: "소셜 로그인 성공" });
	}),
];
