import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import favorites from "../data/favorites";
import { parseFavoritesListRequest } from "../data/favorites/helpers";

export const favoritesHandlers = [
	// GET /api/favorites
	http.get(`${BASE_URL}/favorites`, ({ request }) => {
		const url = new URL(request.url);
		return HttpResponse.json(favorites.list(parseFavoritesListRequest(url)));
	}),

	// GET /api/favorites/count
	http.get(`${BASE_URL}/favorites/count`, () => {
		return HttpResponse.json({ count: favorites.getCount() });
	}),
];
