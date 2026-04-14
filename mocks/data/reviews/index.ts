import type {
	ReviewsListItem,
	ReviewsListRequest,
	ReviewsListResponse,
} from "@/features/reviews/types";
import { MOCK_PLACEHOLDER_IMAGE } from "../../constants";
import { buildReviewsListResponse } from "./helpers";
import { REVIEWS, STATISTICS, CATEGORY_STATISTICS } from "./fixtures";

function listReviews(params: ReviewsListRequest = {}): ReviewsListResponse {
	return buildReviewsListResponse(REVIEWS, params);
}

function listByMeetingId(meetingId: number): ReviewsListResponse {
	const filtered = REVIEWS.filter((r) => r.meetingId === meetingId);
	return { data: filtered, nextCursor: null, hasMore: false };
}

function getReviewsForUser(userId: number): ReviewsListResponse {
	const filtered = REVIEWS.filter((r) => r.userId === userId);
	return { data: filtered, nextCursor: null, hasMore: false };
}

function createReview(meetingId: number, userId: number, body: { score: number; comment: string }) {
	const nextId = Math.max(0, ...REVIEWS.map((r) => r.id)) + 1;
	const newReview: ReviewsListItem = {
		id: nextId,
		meetingId,
		userId,
		score: body.score,
		comment: body.comment,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		user: {
			id: userId,
			email: "test@example.com",
			name: "홍길동",
			image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
		},
		meeting: {
			id: meetingId,
			name: "모임",
			type: "자기계발",
			region: "서울특별시 광진구",
			image: MOCK_PLACEHOLDER_IMAGE,
			dateTime: "",
		},
	};
	REVIEWS.push(newReview);
	return newReview;
}

function updateReview(reviewId: number, body: { score?: number; comment?: string }) {
	const review = REVIEWS.find((r) => r.id === reviewId);
	if (!review) return undefined;
	if (body.score !== undefined) review.score = body.score;
	if (body.comment !== undefined) review.comment = body.comment;
	review.updatedAt = new Date().toISOString();
	return review;
}

function deleteReview(reviewId: number) {
	const idx = REVIEWS.findIndex((r) => r.id === reviewId);
	if (idx >= 0) REVIEWS.splice(idx, 1);
	return idx >= 0;
}

function getStatistics() {
	return STATISTICS;
}

function getCategoryStatistics() {
	return CATEGORY_STATISTICS;
}

export default {
	list: listReviews,
	listByMeetingId,
	getReviewsForUser,
	createReview,
	updateReview,
	deleteReview,
	getStatistics,
	getCategoryStatistics,
};
