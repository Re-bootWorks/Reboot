jest.mock("next/headers", () => ({
	cookies: jest.fn(),
}));

import { cookies } from "next/headers";
import { http, HttpResponse } from "msw";
import { getFavorites } from "@/features/favorites/apis/server";
import favorites from "@/mocks/data/favorites";
import { server } from "@/mocks/server";
import { ApiError } from "@/utils/api";

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

beforeEach(() => {
	mockedCookies.mockResolvedValue(createCookieStore());
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("favorites server apis 테스트", () => {
	describe("getFavorites", () => {
		it("성공 시 찜 목록 데이터를 반환한다", async () => {
			const expectedResponse = favorites.list();

			server.use(http.get(`${TEST_API_BASE}/favorites`, () => HttpResponse.json(expectedResponse)));

			const result = await getFavorites();

			expect(Array.isArray(result.data)).toBe(true);
			expect(result.data[0]).toMatchObject({
				id: expectedResponse.data[0].id,
				meetingId: expectedResponse.data[0].meetingId,
				userId: expectedResponse.data[0].userId,
				createdAt: expectedResponse.data[0].createdAt,
			});
			expect(result.data[0].meeting).toMatchObject({
				id: expectedResponse.data[0].meeting.id,
				name: expectedResponse.data[0].meeting.name,
				type: expectedResponse.data[0].meeting.type,
				region: expectedResponse.data[0].meeting.region,
			});
			expect(result.nextCursor).toBe(expectedResponse.nextCursor);
			expect(result.hasMore).toBe(expectedResponse.hasMore);
		});

		it("필터와 날짜 조건을 쿼리스트링으로 변환해 요청한다", async () => {
			let capturedUrl = "";
			let authorizationHeader = "";

			mockedCookies.mockResolvedValue(createCookieStore({ accessToken: "access-token" }));

			server.use(
				http.get(`${TEST_API_BASE}/favorites`, ({ request }) => {
					capturedUrl = request.url;
					authorizationHeader = request.headers.get("authorization") ?? "";
					return HttpResponse.json(favorites.list());
				}),
			);

			await getFavorites({
				type: "자기계발",
				region: "서울특별시 광진구",
				dateStart: "2026-04-01",
				dateEnd: "2026-04-30",
				sortBy: "participantCount",
				sortOrder: "asc",
				cursor: "10",
				size: 5,
			});

			const url = new URL(capturedUrl);

			expect(url.searchParams.get("type")).toBe("자기계발");
			expect(url.searchParams.get("region")).toBe("서울특별시 광진구");
			expect(url.searchParams.get("dateStart")).toBe("2026-04-01T00:00:00+09:00");
			expect(url.searchParams.get("dateEnd")).toBe("2026-04-30T23:59:59+09:00");
			expect(url.searchParams.get("sortBy")).toBe("participantCount");
			expect(url.searchParams.get("sortOrder")).toBe("asc");
			expect(url.searchParams.get("cursor")).toBe("10");
			expect(url.searchParams.get("size")).toBe("5");
			expect(authorizationHeader).toBe("Bearer access-token");
		});

		it("URLSearchParams 입력을 파싱해 숫자 size만 요청에 포함한다", async () => {
			let capturedUrl = "";

			server.use(
				http.get(`${TEST_API_BASE}/favorites`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(favorites.list());
				}),
			);

			await getFavorites(
				new URLSearchParams({
					type: "운동/스포츠",
					sortBy: "registrationEnd",
					sortOrder: "desc",
					size: "3",
					cursor: "6",
				}),
			);

			const url = new URL(capturedUrl);

			expect(url.searchParams.get("type")).toBe("운동/스포츠");
			expect(url.searchParams.get("sortBy")).toBe("registrationEnd");
			expect(url.searchParams.get("sortOrder")).toBe("desc");
			expect(url.searchParams.get("size")).toBe("3");
			expect(url.searchParams.get("cursor")).toBe("6");
		});

		it("size가 숫자가 아니면 쿼리에서 제외한다", async () => {
			let capturedUrl = "";

			server.use(
				http.get(`${TEST_API_BASE}/favorites`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(favorites.list());
				}),
			);

			await getFavorites(
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
				http.get(`${TEST_API_BASE}/favorites`, () =>
					HttpResponse.json(
						{ message: "찜 목록을 불러오지 못했습니다.", code: "FAVORITES_FETCH_FAILED" },
						{ status: 400 },
					),
				),
			);

			await expect(getFavorites()).rejects.toMatchObject<ApiError>({
				name: "ApiError",
				message: "찜 목록을 불러오지 못했습니다.",
				status: 400,
				code: "FAVORITES_FETCH_FAILED",
			});
		});

		it("에러 응답 바디가 없으면 상태 코드별 기본 메시지로 ApiError를 던진다", async () => {
			server.use(
				http.get(`${TEST_API_BASE}/favorites`, () => new HttpResponse(null, { status: 401 })),
			);

			await expect(getFavorites()).rejects.toMatchObject<ApiError>({
				name: "ApiError",
				message: "인증이 필요합니다",
				status: 401,
			});
		});
	});
});
