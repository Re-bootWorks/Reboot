import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";
import {
	getMeetingDetail,
	getParticipants,
	getReviews,
	postJoin,
	deleteJoin,
	postFavorite,
	deleteFavorite,
	patchMeeting,
	deleteMeeting,
	patchReview,
	deleteReview,
	getRelatedMeetings,
} from "@/features/meetupDetail/apis/apis";

const TEST_API_BASE = "http://localhost/api";

function mockServerError(
	method: "get" | "post" | "patch" | "delete",
	url: string,
	message?: string,
	status = 500,
) {
	server.use(http[method](url, () => HttpResponse.json(message ? { message } : {}, { status })));
}

async function captureUrl(
	method: "get" | "post" | "patch" | "delete",
	url: string,
	callback: () => Promise<unknown>,
) {
	let capturedUrl = "";
	server.use(
		http[method](url, ({ request }) => {
			capturedUrl = request.url;
			return HttpResponse.json({});
		}),
	);
	await callback();
	return capturedUrl;
}

async function captureBody(
	method: "post" | "patch",
	url: string,
	callback: () => Promise<unknown>,
) {
	let capturedBody: Record<string, unknown> = {};
	server.use(
		http[method](url, async ({ request }) => {
			capturedBody = (await request.json()) as Record<string, unknown>;
			return HttpResponse.json({});
		}),
	);
	await callback();
	return capturedBody;
}

// ─────────────────────────────────────────────
// getMeetingDetail
// ─────────────────────────────────────────────
describe("모임 상세 조회 api", () => {
	it("모임 상세 데이터를 정상적으로 반환한다.", async () => {
		const result = await getMeetingDetail(1);
		expect(result.id).toBe(1);
		expect(result.name).toBe("주말 독서 모임");
		expect(result.hostId).toBe(1);
	});

	it("존재하지 않는 모임 ID라면 에러를 던진다.", async () => {
		await expect(getMeetingDetail(999)).rejects.toThrow("모임 정보를 불러오지 못했습니다.");
	});
});

// ─────────────────────────────────────────────
// getParticipants
// ─────────────────────────────────────────────
describe("모임 상세 - 참가자 목록 조회 api", () => {
	it("참가자 목록을 정상적으로 반환한다.", async () => {
		const result = await getParticipants(1);
		expect(result.data.length).toBeGreaterThan(0);
		expect(result.data[0].meetingId).toBe(1);
	});

	it("cursor 값이 없다면, 쿼리 파라미터에 포함하지 않는다.", async () => {
		const url = await captureUrl("get", `${TEST_API_BASE}/meetings/1/participants`, () =>
			getParticipants(1),
		);
		expect(url).not.toContain("cursor=");
	});

	it("서버 에러 시 에러를 던진다.", async () => {
		mockServerError("get", `${TEST_API_BASE}/meetings/1/participants`);
		await expect(getParticipants(1)).rejects.toThrow("참가자 목록을 불러오지 못했습니다.");
	});
});

// ─────────────────────────────────────────────
// getReviews
// ─────────────────────────────────────────────
describe("모임 상세 - 리뷰 목록 조회 api", () => {
	it("리뷰 목록을 정상적으로 반환한다.", async () => {
		const result = await getReviews(1);
		expect(Array.isArray(result.data)).toBe(true);
		expect(result.data[0].meetingId).toBe(1);
	});

	it("size=4 파라미터가 항상 포함된다.", async () => {
		const url = await captureUrl("get", `${TEST_API_BASE}/meetings/1/reviews`, () => getReviews(1));
		expect(url).toContain("size=4");
	});

	it("cursor가 있으면 쿼리 파라미터에 포함된다.", async () => {
		const url = await captureUrl("get", `${TEST_API_BASE}/meetings/1/reviews`, () =>
			getReviews(1, "some-cursor"),
		);
		expect(url).toContain("cursor=some-cursor");
	});

	it("서버 에러 시 에러를 던진다.", async () => {
		mockServerError("get", `${TEST_API_BASE}/meetings/1/reviews`);
		await expect(getReviews(1)).rejects.toThrow("리뷰 목록을 불러오지 못했습니다.");
	});
});

// ─────────────────────────────────────────────
// postJoin
// ─────────────────────────────────────────────
describe("모임 상세 - 참여하기 api", () => {
	it("참여 요청이 성공한다.", async () => {
		server.use(
			http.post(`${TEST_API_BASE}/meetings/1/join`, () =>
				HttpResponse.json({ message: "참여 성공" }),
			),
		);
		await expect(postJoin(1)).resolves.not.toThrow();
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("post", `${TEST_API_BASE}/meetings/1/join`, "이미 참여한 모임입니다.", 409);
		await expect(postJoin(1)).rejects.toThrow("이미 참여한 모임입니다.");
	});

	it("서버 에러 메시지가 없으면 기본 에러 메시지를 던진다.", async () => {
		mockServerError("post", `${TEST_API_BASE}/meetings/1/join`);
		await expect(postJoin(1)).rejects.toThrow("모임 참여에 실패했습니다.");
	});
});

// ─────────────────────────────────────────────
// deleteJoin
// ─────────────────────────────────────────────
describe("모임 상세 - 참여 취소 api", () => {
	it("참여 취소 요청이 성공한다.", async () => {
		server.use(
			http.delete(`${TEST_API_BASE}/meetings/1/join`, () =>
				HttpResponse.json({ message: "참여 취소 성공" }),
			),
		);
		await expect(deleteJoin(1)).resolves.not.toThrow();
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("delete", `${TEST_API_BASE}/meetings/1/join`, "참여하지 않은 모임입니다.", 400);
		await expect(deleteJoin(1)).rejects.toThrow("참여하지 않은 모임입니다.");
	});

	it("서버 에러 메시지가 없으면 기본 에러 메시지를 던진다.", async () => {
		mockServerError("delete", `${TEST_API_BASE}/meetings/1/join`);
		await expect(deleteJoin(1)).rejects.toThrow("모임 참여 취소에 실패했습니다.");
	});
});

// ─────────────────────────────────────────────
// postFavorite
// ─────────────────────────────────────────────
describe("모임 상세 - 찜 추가 api", () => {
	it("찜 추가 요청이 성공한다.", async () => {
		await expect(postFavorite(1)).resolves.not.toThrow();
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("post", `${TEST_API_BASE}/meetings/1/favorites`, "이미 찜한 모임입니다.", 409);
		await expect(postFavorite(1)).rejects.toThrow("이미 찜한 모임입니다.");
	});

	it("서버 에러 메시지가 없으면 기본 에러 메시지를 던진다.", async () => {
		mockServerError("post", `${TEST_API_BASE}/meetings/1/favorites`);
		await expect(postFavorite(1)).rejects.toThrow("찜 추가에 실패했습니다.");
	});
});

// ─────────────────────────────────────────────
// deleteFavorite
// ─────────────────────────────────────────────
describe("모임 상세 - 찜 해제 api", () => {
	it("찜 해제 요청이 성공한다.", async () => {
		await expect(deleteFavorite(1)).resolves.not.toThrow();
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError(
			"delete",
			`${TEST_API_BASE}/meetings/1/favorites`,
			"찜하지 않은 모임입니다.",
			400,
		);
		await expect(deleteFavorite(1)).rejects.toThrow("찜하지 않은 모임입니다.");
	});

	it("서버 에러 메시지가 없으면 기본 에러 메시지를 던진다.", async () => {
		mockServerError("delete", `${TEST_API_BASE}/meetings/1/favorites`);
		await expect(deleteFavorite(1)).rejects.toThrow("찜 해제에 실패했습니다.");
	});
});

// ─────────────────────────────────────────────
// patchMeeting
// ─────────────────────────────────────────────
describe("모임 상세 - 모임 수정 api", () => {
	it("모임 수정 요청이 성공한다.", async () => {
		await expect(patchMeeting(1, mockEditInitialData)).resolves.not.toThrow();
	});

	it("_addressName, _addressDetail은 요청 body에 포함되지 않는다.", async () => {
		const body = await captureBody("patch", `${TEST_API_BASE}/meetings/1`, () =>
			patchMeeting(1, mockEditInitialData),
		);
		expect(body._addressName).toBeUndefined();
		expect(body._addressDetail).toBeUndefined();
		expect(body.name).toBe("달램핏 모임");
	});

	it("존재하지 않는 모임 수정 시 에러를 던진다.", async () => {
		await expect(patchMeeting(999, mockEditInitialData)).rejects.toThrow(
			"모임을 찾을 수 없습니다.",
		);
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("patch", `${TEST_API_BASE}/meetings/1`, "수정 권한이 없습니다.", 403);
		await expect(patchMeeting(1, mockEditInitialData)).rejects.toThrow("수정 권한이 없습니다.");
	});
});

// ─────────────────────────────────────────────
// deleteMeeting
// ─────────────────────────────────────────────
describe("모임 상세 - 모임 삭제 api", () => {
	it("모임 삭제 요청이 성공한다.", async () => {
		await expect(deleteMeeting(1)).resolves.not.toThrow();
	});

	it("존재하지 않는 모임 삭제 시 에러를 던진다.", async () => {
		await expect(deleteMeeting(999)).rejects.toThrow("모임을 찾을 수 없습니다.");
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("delete", `${TEST_API_BASE}/meetings/1`, "삭제 권한이 없습니다.", 403);
		await expect(deleteMeeting(1)).rejects.toThrow("삭제 권한이 없습니다.");
	});
});

// ─────────────────────────────────────────────
// patchReview
// ─────────────────────────────────────────────
describe("모임 상세 - 리뷰 수정 api", () => {
	it("리뷰 수정 요청이 성공한다.", async () => {
		await expect(patchReview(1, { score: 5, comment: "수정된 리뷰" })).resolves.not.toThrow();
	});

	it("수정된 score, comment가 요청 body에 올바르게 포함된다.", async () => {
		const body = await captureBody("patch", `${TEST_API_BASE}/reviews/1`, () =>
			patchReview(1, { score: 4, comment: "수정된 리뷰 내용" }),
		);
		expect(body.score).toBe(4);
		expect(body.comment).toBe("수정된 리뷰 내용");
	});

	it("존재하지 않는 리뷰 수정 시 에러를 던진다.", async () => {
		await expect(patchReview(999, { score: 5, comment: "수정된 리뷰" })).rejects.toThrow(
			"리뷰를 찾을 수 없습니다.",
		);
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("patch", `${TEST_API_BASE}/reviews/1`, "수정 권한이 없습니다.", 403);
		await expect(patchReview(1, { score: 5, comment: "수정된 리뷰" })).rejects.toThrow(
			"수정 권한이 없습니다.",
		);
	});
});

// ─────────────────────────────────────────────
// deleteReview
// ─────────────────────────────────────────────
describe("모임 상세 - 리뷰 삭제 api", () => {
	it("리뷰 삭제 요청이 성공한다.", async () => {
		await expect(deleteReview(1)).resolves.not.toThrow();
	});

	it("존재하지 않는 리뷰 삭제 시 에러를 던진다.", async () => {
		await expect(deleteReview(999)).rejects.toThrow("리뷰를 찾을 수 없습니다.");
	});

	it("서버 에러 메시지를 그대로 던진다.", async () => {
		mockServerError("delete", `${TEST_API_BASE}/reviews/1`, "삭제 권한이 없습니다.", 403);
		await expect(deleteReview(1)).rejects.toThrow("삭제 권한이 없습니다.");
	});
});

// ─────────────────────────────────────────────
// getRelatedMeetings
// ─────────────────────────────────────────────
describe("모임 상세 - 관련 모임 목록 조회 api", () => {
	it("현재 보고 있는 모임은 결과에서 제외된다.", async () => {
		const result = await getRelatedMeetings(1, "서울 특별시 광진구", "자기계발");
		expect(result.data.every((meet) => meet.id !== 1)).toBe(true);
	});

	it("마감된 모임은 결과에서 제외된다.", async () => {
		const result = await getRelatedMeetings(1, "서울특별시 광진구", "자기계발");
		const now = new Date().toISOString();
		expect(result.data.every((meet) => meet.registrationEnd > now)).toBe(true);
	});

	it("최대 4개까지만 반환한다.", async () => {
		const result = await getRelatedMeetings(1, "서울특별시 광진구", "자기계발");
		expect(result.data.length).toBeLessThanOrEqual(4);
	});

	it("region, type 파라미터가 쿼리 파라미터에 포함된다.", async () => {
		let capturedUrl = "";
		server.use(
			http.get(`${TEST_API_BASE}/meetings`, ({ request }) => {
				capturedUrl = request.url;
				return HttpResponse.json({
					data: [],
					nextCursor: null,
					hasMore: false,
					totalCount: 0,
					currentOffset: 0,
					limit: 5,
				});
			}),
		);
		await getRelatedMeetings(1, "서울특별시 광진구", "자기계발");
		const params = new URL(capturedUrl).searchParams;
		expect(params.get("region")).toBe("서울특별시 광진구");
		expect(params.get("type")).toBe("자기계발");
	});

	it("서버 에러 시 에러를 던진다.", async () => {
		mockServerError("get", `${TEST_API_BASE}/meetings`);
		await expect(getRelatedMeetings(1, "서울특별시 광진구", "자기계발")).rejects.toThrow();
	});
});
