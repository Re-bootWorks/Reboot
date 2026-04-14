import { ApiError, getUserErrorMessage, parseJsonSafely, throwApiError } from "./api";

interface createMockResponseType {
	ok?: boolean;
	status?: number;
	json: () => Promise<unknown>;
}
function createMockResponse({
	ok = true,
	status = 200,
	json = jest.fn(),
}: createMockResponseType): Response {
	return { ok, status, json } as Response;
}
describe("utils/api", () => {
	describe("parseJsonSafely()", () => {
		test("JSON 파싱에 성공하면 파싱된 데이터를 반환한다", async () => {
			const res = createMockResponse({
				json: jest.fn().mockResolvedValue({ id: 1, name: "홍길동" }),
			});

			const result = await parseJsonSafely(res);

			expect(result).toEqual({ id: 1, name: "홍길동" });
		});
		test("JSON 파싱에 실패하면 null을 반환한다", async () => {
			const res = createMockResponse({
				json: jest.fn().mockRejectedValue(new Error("파싱에 실패했습니다")),
			});

			const result = await parseJsonSafely(res);

			expect(result).toBeNull();
		});
	});

	describe("throwApiError()", () => {
		describe("응답에 성공했을 때", () => {
			test("아무것도 throw하지 않는다", async () => {
				const res = createMockResponse({
					ok: true,
					json: jest.fn().mockResolvedValue({ success: true }),
				});
				const result = await throwApiError(res, "기본 에러 메세지");
				expect(result).toBeUndefined(); // throw하지 않고 정상 반환 시 undefined
			});
		});
		describe("응답에 실패했을 때", () => {
			test("응답 바디에message가 있으면 ApiError를 던진다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 400,
					json: jest.fn().mockResolvedValue({
						code: "BAD_REQUEST",
						message: "잘못된 요청입니다",
					}),
				});

				try {
					await throwApiError(res, "기본 에러 메시지");
				} catch (error) {
					expect(error).toBeInstanceOf(ApiError); // 에러 종류 검증
					expect((error as ApiError).message).toBe("잘못된 요청입니다");
					expect(error).toMatchObject({
						// 에러 내용 검증
						status: 400,
						code: "BAD_REQUEST",
						fallbackMessage: "기본 에러 메시지",
					});
				}
			});

			test("응답 바디에 message가 없으면 fallbackMessage로 ApiError를 던진다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 400,
					json: jest.fn().mockResolvedValue({
						code: "BAD_REQUEST",
					}),
				});

				try {
					await throwApiError(res, "기본 에러 메시지");
				} catch (error) {
					expect(error).toBeInstanceOf(ApiError);
					expect(error).toMatchObject({
						message: "기본 에러 메시지",
						status: 400,
						code: "BAD_REQUEST",
						fallbackMessage: "기본 에러 메시지",
					});
				}
			});

			test("JSON 파싱에 실패하면 fallbackMessage로 ApiError를 던진다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 500,
					json: jest.fn().mockRejectedValue(new Error("오류가 발생했습니다")),
				});

				try {
					await throwApiError(res, "서버 오류가 발생했습니다.");
				} catch (error) {
					expect(error).toBeInstanceOf(ApiError);
					expect(error).toMatchObject({
						message: "서버 오류가 발생했습니다.",
						status: 500,
						code: undefined,
						fallbackMessage: "서버 오류가 발생했습니다.",
					});
				}
			});
		});
	});

	describe("getUserErrorMessage()", () => {
		test("ApiError면 message를 반환한다", () => {
			const error = new ApiError({
				message: "백엔드 에러 메시지",
				status: 400,
				code: "BAD_REQUEST",
				fallbackMessage: "기본 에러 메시지",
			});

			const result = getUserErrorMessage(error, "기본 에러 메시지");

			expect(result).toBe("백엔드 에러 메시지");
		});

		test("일반 Error면 message를 반환한다", () => {
			const error = new Error("일반 에러 메시지");

			const result = getUserErrorMessage(error, "기본 에러 메시지");

			expect(result).toBe("일반 에러 메시지");
		});

		test("Error가 아니면 fallback을 반환한다", () => {
			const result = getUserErrorMessage("unknown error", "기본 에러 메시지");

			expect(result).toBe("기본 에러 메시지");
		});
	});
});
// - getUserErrorMessage는 리액트 쿼리에서 toast에 노출할 에러메세지를 위한 유틸함수 추가
