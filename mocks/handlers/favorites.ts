import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";

export const favoritesHandlers = [
	// GET /api/favorites/count
	http.get(`${BASE_URL}/favorites/count`, () => {
		return HttpResponse.json({ count: 1 });
	}),
];
