import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import meetings from "../data/meetings";
import reviews from "../data/reviews";
import { parseMeetupListRequest } from "../data/meetings/helpers";

export const meetingsHandlers = [
	// GET /api/meetings
	http.get(`${BASE_URL}/meetings`, ({ request }) => {
		const url = new URL(request.url);
		return HttpResponse.json(meetings.list(parseMeetupListRequest(url)));
	}),

	// POST /api/meetings
	http.post(`${BASE_URL}/meetings`, async ({ request }) => {
		const body = await request.json();
		const created = meetings.post(body as Parameters<typeof meetings.post>[0]);
		return HttpResponse.json(created, { status: 201 });
	}),

	// GET /meetings/joined
	http.get(`${BASE_URL}/meetings/joined`, ({ request }) => {
		const url = new URL(request.url);
		const toBool = (v: string | null) => (v === "true" ? true : v === "false" ? false : undefined);
		const filters = {
			completed: toBool(url.searchParams.get("completed")),
			reviewed: toBool(url.searchParams.get("reviewed")),
		};
		return HttpResponse.json(meetings.getJoined(filters));
	}),

	// GET /meetings/my
	http.get(`${BASE_URL}/meetings/my`, () => {
		return HttpResponse.json(meetings.getMy());
	}),

	// GET /api/meetings/:meetingId
	http.get(`${BASE_URL}/meetings/:meetingId`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const meeting = meetings.getById(meetingId);
		if (!meeting)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(meeting);
	}),

	// PATCH /api/meetings/:meetingId
	http.patch(`${BASE_URL}/meetings/:meetingId`, async ({ params, request }) => {
		const meetingId = Number(params.meetingId);
		const body = await request.json();
		const updated = meetings.update(meetingId, body as Parameters<typeof meetings.update>[1]);
		if (!updated)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(updated);
	}),

	// DELETE /api/meetings/:meetingId
	http.delete(`${BASE_URL}/meetings/:meetingId`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const deleted = meetings.delete(meetingId);
		if (!deleted)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "삭제 성공" });
	}),

	// POST /api/meetings/:meetingId/join
	http.post(`${BASE_URL}/meetings/:meetingId/join`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const result = meetings.join(meetingId);
		if (!result.ok) {
			const status = result.reason === "NOT_FOUND" ? 404 : 409;
			return HttpResponse.json({ code: result.reason, message: result.reason }, { status });
		}
		return HttpResponse.json({ message: "참여 성공" });
	}),

	// DELETE /api/meetings/:meetingId/join
	http.delete(`${BASE_URL}/meetings/:meetingId/join`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const result = meetings.leave(meetingId);
		if (!result.ok) {
			const status = result.reason === "NOT_FOUND" ? 404 : 400;
			return HttpResponse.json({ code: result.reason, message: result.reason }, { status });
		}
		return HttpResponse.json({ message: "참여 취소 성공" });
	}),

	// POST /api/meetings/:meetingId/favorites
	http.post(`${BASE_URL}/meetings/:meetingId/favorites`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const meeting = meetings.toggleFavorite(meetingId, true);
		if (!meeting)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(meeting, { status: 201 });
	}),

	// DELETE /api/meetings/:meetingId/favorites
	http.delete(`${BASE_URL}/meetings/:meetingId/favorites`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		const meeting = meetings.toggleFavorite(meetingId, false);
		if (!meeting)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "찜 해제 성공" });
	}),

	// GET /api/meetings/:meetingId/participants
	http.get(`${BASE_URL}/meetings/:meetingId/participants`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		return HttpResponse.json(meetings.getParticipants(meetingId));
	}),

	// PATCH /api/meetings/:meetingId/status
	http.patch(`${BASE_URL}/meetings/:meetingId/status`, async ({ params, request }) => {
		const meetingId = Number(params.meetingId);
		const body = (await request.json()) as { status: "CONFIRMED" | "CANCELED" };
		const updated = meetings.updateStatus(meetingId, body.status);
		if (!updated)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "모임을 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(updated);
	}),

	// GET /api/meetings/:meetingId/reviews
	http.get(`${BASE_URL}/meetings/:meetingId/reviews`, ({ params }) => {
		const meetingId = Number(params.meetingId);
		return HttpResponse.json(reviews.listByMeetingId(meetingId));
	}),

	// POST /api/meetings/:meetingId/reviews
	http.post(`${BASE_URL}/meetings/:meetingId/reviews`, async ({ params, request }) => {
		const meetingId = Number(params.meetingId);
		const body = (await request.json()) as { score: number; comment: string };
		const created = reviews.createReview(meetingId, 1, body);
		return HttpResponse.json(created, { status: 201 });
	}),
];
