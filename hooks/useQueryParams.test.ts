import { renderHook, act } from "@testing-library/react";
import { useQueryParams } from "./useQueryParams";

jest.mock("next/navigation", () => ({
	useSearchParams: () => new URLSearchParams(window.location.search),
}));

beforeEach(() => {
	window.history.replaceState(null, "", "/");
});

describe("useQueryParams 커스텀 훅 테스트", () => {
	test("get 함수 실행 시 해당 키의 쿼리 파라미터 값을 반환", () => {
		window.history.replaceState(null, "", "?tab=info&page=2");
		const { result } = renderHook(() => useQueryParams());

		expect(result.current.get("tab")).toBe("info");
		expect(result.current.get("page")).toBe("2");
		expect(result.current.get("missing")).toBeNull();
	});

	test("set 함수 실행 시 쿼리 파라미터가 URL에 반영", () => {
		window.history.replaceState(null, "", "?tab=info");
		const { result } = renderHook(() => useQueryParams());

		act(() => {
			result.current.set({ tab: "review", page: "3" });
		});

		const updated = new URLSearchParams(window.location.search);
		expect(updated.get("tab")).toBe("review");
		expect(updated.get("page")).toBe("3");
	});

	test("set 함수에 null 전달 시 해당 쿼리 파라미터가 URL에서 삭제", () => {
		window.history.replaceState(null, "", "?tab=info&page=2");
		const { result } = renderHook(() => useQueryParams());

		act(() => {
			result.current.set({ tab: null, page: "5" });
		});

		const updated = new URLSearchParams(window.location.search);
		expect(updated.has("tab")).toBe(false);
		expect(updated.get("page")).toBe("5");
	});
});
