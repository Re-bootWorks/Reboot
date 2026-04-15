import { http, HttpResponse } from "msw";
import { BASE_URL } from "../constants";
import reviews from "../data/reviews";
import { parseReviewsListRequest } from "../data/reviews/helpers";

export const reviewsHandlers = [
	// GET /api/reviews
	http.get(`${BASE_URL}/reviews`, ({ request }) => {
		const url = new URL(request.url);
		return HttpResponse.json(reviews.list(parseReviewsListRequest(url)));
	}),

	// GET /api/reviews/statistics
	http.get(`${BASE_URL}/reviews/statistics`, () => {
		return HttpResponse.json(reviews.getStatistics());
	}),

	// GET /api/reviews/categories/statistics
	http.get(`${BASE_URL}/reviews/categories/statistics`, () => {
		return HttpResponse.json(reviews.getCategoryStatistics());
	}),

	// PATCH /api/reviews/:reviewId
	http.patch(`${BASE_URL}/reviews/:reviewId`, async ({ params, request }) => {
		const reviewId = Number(params.reviewId);
		const body = (await request.json()) as { score?: number; comment?: string };
		const updated = reviews.updateReview(reviewId, body);
		if (!updated)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "리뷰를 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json(updated);
	}),

	// DELETE /api/reviews/:reviewId
	http.delete(`${BASE_URL}/reviews/:reviewId`, ({ params }) => {
		const reviewId = Number(params.reviewId);
		const deleted = reviews.deleteReview(reviewId);
		if (!deleted)
			return HttpResponse.json(
				{ code: "NOT_FOUND", message: "리뷰를 찾을 수 없습니다." },
				{ status: 404 },
			);
		return HttpResponse.json({ message: "삭제 성공" });
	}),
];
