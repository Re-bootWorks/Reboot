import { parseJsonSafely, throwApiError } from "./api";

interface createMockResponseType {
	ok?: boolean;
	status?: number;
	json: () => Promise<unknown>;
}
function createMockResponse({ ok = true, status = 200, json }: createMockResponseType): Response {
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
			test("응답 바디의 message로 에러를 throw한다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 400,
					json: jest.fn().mockResolvedValue({
						code: "BAD_REQUEST",
						message: "잘못된 요청입니다",
					}),
				});

				await expect(throwApiError(res, "기본 에러 메시지")).rejects.toThrow("잘못된 요청입니다");
			});
			test("응답 바디에 message가 없으면 fallbackMessage로 throw한다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 400,
					json: jest.fn().mockResolvedValue({
						code: "BAD_REQUEST",
					}),
				});

				await expect(throwApiError(res, "기본 에러 메시지")).rejects.toThrow("기본 에러 메시지");
			});
			test("JSON 파싱에 실패하면 fallbackMessage로 throw한다", async () => {
				const res = createMockResponse({
					ok: false,
					status: 500,
					json: jest.fn().mockRejectedValue(new Error("오류가 발생했습니다")),
				});
				await expect(throwApiError(res, "서버 오류가 발생했습니다.")).rejects.toThrow(
					"서버 오류가 발생했습니다.",
				);
			});
		});
	});
});
