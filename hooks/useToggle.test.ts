import { act, renderHook } from "@testing-library/react";
import useToggle from "./useToggle";

describe("useToggle", () => {
	describe("초기값 확인", () => {
		test("인자를 넣지 않으면 isOpen 은 false다", () => {
			const { result } = renderHook(() => useToggle());

			expect(result.current.isOpen).toBe(false);
		});
	});

	describe("toggle() 함수 확인", () => {
		test("toggle을 호출하면 상태가 반전된다", () => {
			const { result } = renderHook(() => useToggle());
			expect(result.current.isOpen).toBe(false);

			// false → true
			act(() => result.current.toggle());
			expect(result.current.isOpen).toBe(true);

			// true → false
			act(() => result.current.toggle());
			expect(result.current.isOpen).toBe(false);
		});
	});

	describe("open() 함수 확인", () => {
		test("초기값이 false인 상태에서 open()을 실행하면 true로 변경된다", () => {
			const { result } = renderHook(() => useToggle());

			act(() => result.current.open());

			expect(result.current.isOpen).toBe(true);
		});
	});

	describe("close() 함수 확인", () => {
		test("초기값이 true인 상태에서 close()를 실행하면 false로 변경된다", () => {
			const { result } = renderHook(() => useToggle(true));

			act(() => result.current.close());

			expect(result.current.isOpen).toBe(false);
		});
	});

	describe("open/close/toggle 조합 동작 확인", () => {
		test("open() 후 close() 하면 false다", () => {
			const { result } = renderHook(() => useToggle());

			act(() => result.current.open());
			act(() => result.current.close());

			expect(result.current.isOpen).toBe(false);
		});
		test("toggle()로 열고 close() 닫을 수 있다", () => {
			const { result } = renderHook(() => useToggle());

			act(() => result.current.toggle());
			act(() => result.current.close());

			expect(result.current.isOpen).toBe(false);
		});
	});
});
