import { http, HttpResponse } from "msw";
import { CLIENT_URL } from "../constants";
import meetings from "../data/meetings";

export const meetingsHandlers = [
	http.get(`${CLIENT_URL}/meetings`, () => {
		return HttpResponse.json(meetings.get());
	}),
];
