import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import users from "../data/users";
import reviews from "../data/reviews";

function hasAccessTokenCookie(request: Request): boolean {
	const raw = request.headers.get("cookie") ?? "";
	return /(?:^|; )accessToken=/.test(raw);
}

export const usersHandlers = [
	// GET /api/users/me
	http.get(`${BASE_URL}/users/me`, ({ request }) => {
		if (!hasAccessTokenCookie(request)) {
			return HttpResponse.json(
				{ code: "UNAUTHORIZED", message: "인증이 필요합니다." },
				{ status: 401 },
			);
		}
		return HttpResponse.json(users.getMe());
	}),

	// PATCH /api/users/me
	http.patch(`${BASE_URL}/users/me`, async ({ request }) => {
		if (!hasAccessTokenCookie(request)) {
			return HttpResponse.json(
				{ code: "UNAUTHORIZED", message: "인증이 필요합니다." },
				{ status: 401 },
			);
		}
		const body = (await request.json()) as Record<string, unknown>;
		const updated = users.updateMe(body);
		return HttpResponse.json(updated);
	}),

	// GET /users/me/reviews
	http.get(`${BASE_URL}/users/me/reviews`, ({ request }) => {
		if (!hasAccessTokenCookie(request)) {
			return HttpResponse.json(
				{ code: "UNAUTHORIZED", message: "인증이 필요합니다." },
				{ status: 401 },
			);
		}
		return HttpResponse.json(reviews.getReviewsForUser(1));
	}),

	// GET /api/users/:userId
	http.get(`${BASE_URL}/users/:userId`, ({ params }) => {
		const userId = Number(params.userId);
		const user = users.getUserById(userId);
		if (!user)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "유저를 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(user);
	}),
];
