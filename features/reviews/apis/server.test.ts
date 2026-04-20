jest.mock("next/headers", () => ({
	cookies: jest.fn(),
}));

import { cookies } from "next/headers";
import { http, HttpResponse } from "msw";
import {
	getReviews,
	getReviewsCategoriesStatistics,
	getReviewsStatistics,
} from "@/features/reviews/apis/server";
import { server } from "@/mocks/server";
import { ApiError } from "@/utils/api";
import type {
	RatingSummaryResponse,
	ReviewCategoryStatistics,
	ReviewsListItem,
	ReviewsListResponse,
} from "../types";

const TEST_API_BASE = "http://localhost/api";

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function createCookieStore(tokens: { accessToken?: string; refreshToken?: string } = {}) {
	return {
		get: jest.fn((name: string) => {
			if (name === "accessToken" && tokens.accessToken) {
				return { name, value: tokens.accessToken };
			}

			if (name === "refreshToken" && tokens.refreshToken) {
				return { name, value: tokens.refreshToken };
			}

			return undefined;
		}),
		set: jest.fn(),
		delete: jest.fn(),
	} as unknown as CookieStore;
}

const reviewItem: ReviewsListItem = {
	id: 1,
	meetingId: 101,
	userId: 7,
	score: 5,
	comment: "정말 만족스러운 모임이었어요.",
	createdAt: "2026-04-10T09:00:00.000Z",
	updatedAt: "2026-04-10T09:00:00.000Z",
	user: {
		id: 7,
		email: "tester@example.com",
		name: "테스터",
		image: null,
	},
	meeting: {
		id: 101,
		name: "아침 러닝 모임",
		type: "운동/스포츠",
		region: "서울특별시 광진구",
		image: "https://example.com/review.jpg",
		dateTime: "2026-04-20T07:00:00.000Z",
	},
};

const reviewsListResponse: ReviewsListResponse = {
	data: [reviewItem],
	nextCursor: null,
	hasMore: false,
};

const ratingSummaryResponse: RatingSummaryResponse = {
	averageScore: 4.6,
	totalReviews: 12,
	oneStar: 0,
	twoStars: 1,
	threeStars: 2,
	fourStars: 4,
	fiveStars: 5,
};

const categoryStatisticsResponse: ReviewCategoryStatistics = [
	{
		type: "운동/스포츠",
		averageScore: 4.7,
		totalReviews: 7,
		oneStar: 0,
		twoStars: 0,
		threeStars: 1,
		fourStars: 2,
		fiveStars: 4,
	},
	{
		type: "자기계발",
		averageScore: 4.3,
		totalReviews: 5,
		oneStar: 0,
		twoStars: 1,
		threeStars: 1,
		fourStars: 2,
		fiveStars: 1,
	},
];

beforeEach(() => {
	mockedCookies.mockResolvedValue(createCookieStore());
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("reviews server apis 테스트", () => {
	describe("getReviews", () => {
		it("성공 시 리뷰 목록 데이터를 반환한다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/reviews`, () => HttpResponse.json(reviewsListResponse)),
			);

			const result = await getReviews();

			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data[0]).toMatchObject({
				id: reviewItem.id,
				meetingId: reviewItem.meetingId,
				userId: reviewItem.userId,
				score: reviewItem.score,
				comment: reviewItem.comment,
			});
			expect(result.nextCursor).toBeNull();
			expect(result.hasMore).toBe(false);
		});

		it("필터와 날짜 조건을 쿼리스트링으로 변환해 요청한다", async () => {
			let capturedUrl = "";
			let authorizationHeader = "";

			mockedCookies.mockResolvedValue(createCookieStore({ accessToken: "access-token" }));

			server.use(
				http.get(`${TEST_API_BASE}/reviews`, ({ request }) => {
					capturedUrl = request.url;
					authorizationHeader = request.headers.get("authorization") ?? "";
					return HttpResponse.json(reviewsListResponse);
				}),
			);

			await getReviews({
				type: "운동/스포츠",
				region: "서울특별시 광진구",
				dateStart: "2026-04-01",
				dateEnd: "2026-04-30",
				registrationEndStart: "2026-03-20",
				registrationEndEnd: "2026-03-25",
				sortBy: "dateTime",
				sortOrder: "asc",
				cursor: "10",
				size: 5,
			});

			const url = new URL(capturedUrl);

			expect(url.searchParams.get("type")).toBe("운동/스포츠");
			expect(url.searchParams.get("region")).toBe("서울특별시 광진구");
			expect(url.searchParams.get("dateStart")).toBe("2026-04-01T00:00:00+09:00");
			expect(url.searchParams.get("dateEnd")).toBe("2026-04-30T23:59:59+09:00");
			expect(url.searchParams.get("registrationEndStart")).toBe("2026-03-20T00:00:00+09:00");
			expect(url.searchParams.get("registrationEndEnd")).toBe("2026-03-25T23:59:59+09:00");
			expect(url.searchParams.get("sortBy")).toBe("dateTime");
			expect(url.searchParams.get("sortOrder")).toBe("asc");
			expect(url.searchParams.get("cursor")).toBe("10");
			expect(url.searchParams.get("size")).toBe("5");
			expect(authorizationHeader).toBe("Bearer access-token");
		});

		it("URLSearchParams 입력을 파싱해 숫자 size만 요청에 포함한다", async () => {
			let capturedUrl = "";

			server.use(
				http.get(`${TEST_API_BASE}/reviews`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(reviewsListResponse);
				}),
			);

			await getReviews(
				new URLSearchParams({
					type: "자기계발",
					sortBy: "participantCount",
					sortOrder: "desc",
					size: "3",
					cursor: "6",
				}),
			);

			const url = new URL(capturedUrl);

			expect(url.searchParams.get("type")).toBe("자기계발");
			expect(url.searchParams.get("sortBy")).toBe("participantCount");
			expect(url.searchParams.get("sortOrder")).toBe("desc");
			expect(url.searchParams.get("size")).toBe("3");
			expect(url.searchParams.get("cursor")).toBe("6");
		});

		it("size가 숫자가 아니면 쿼리에서 제외한다", async () => {
			let capturedUrl = "";

			server.use(
				http.get(`${TEST_API_BASE}/reviews`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(reviewsListResponse);
				}),
			);

			await getReviews(
				new URLSearchParams({
					type: "여행",
					size: "not-a-number",
				}),
			);

			const url = new URL(capturedUrl);

			expect(url.searchParams.get("type")).toBe("여행");
			expect(url.searchParams.has("size")).toBe(false);
		});

		it("실패 시 응답 메시지와 status를 담은 ApiError를 던진다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/reviews`, () =>
					HttpResponse.json(
						{ message: "리뷰 목록 조회에 실패했습니다.", code: "REVIEWS_FETCH_FAILED" },
						{ status: 400 },
					),
				),
			);

			await expect(getReviews()).rejects.toMatchObject<ApiError>({
				name: "ApiError",
				message: "리뷰 목록 조회에 실패했습니다.",
				status: 400,
				code: "REVIEWS_FETCH_FAILED",
			});
		});
	});

	describe("getReviewsStatistics", () => {
		it("성공 시 전체 평점 요약을 반환한다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/reviews/statistics`, () =>
					HttpResponse.json(ratingSummaryResponse),
				),
			);

			await expect(getReviewsStatistics()).resolves.toEqual(ratingSummaryResponse);
		});

		it("에러 응답 바디가 없으면 기본 메시지로 ApiError를 던진다", async () => {
			server.use(
				http.get(
					`${TEST_API_BASE}/reviews/statistics`,
					() => new HttpResponse(null, { status: 500 }),
				),
			);

			await expect(getReviewsStatistics()).rejects.toMatchObject<ApiError>({
				name: "ApiError",
				message: "리뷰 전체 통계 조회에 실패했습니다.",
				status: 500,
			});
		});
	});

	describe("getReviewsCategoriesStatistics", () => {
		it("성공 시 카테고리별 평점 통계를 반환한다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/reviews/categories/statistics`, () =>
					HttpResponse.json(categoryStatisticsResponse),
				),
			);

			const result = await getReviewsCategoriesStatistics();

			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toMatchObject({
				type: categoryStatisticsResponse[0].type,
				averageScore: categoryStatisticsResponse[0].averageScore,
				totalReviews: categoryStatisticsResponse[0].totalReviews,
			});
			expect(result).toHaveLength(categoryStatisticsResponse.length);
		});

		it("실패 시 응답 메시지와 status를 담은 ApiError를 던진다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/reviews/categories/statistics`, () =>
					HttpResponse.json(
						{ message: "카테고리별 리뷰 통계를 불러오지 못했습니다." },
						{ status: 503 },
					),
				),
			);

			await expect(getReviewsCategoriesStatistics()).rejects.toMatchObject<ApiError>({
				name: "ApiError",
				message: "카테고리별 리뷰 통계를 불러오지 못했습니다.",
				status: 503,
			});
		});
	});
});
