import { act, renderHook } from "@testing-library/react";
import useMediaQuery from "./useMediaQuery";

type MatchMediaChangeHandler = (event: Pick<MediaQueryListEvent, "matches" | "media">) => void;

describe("useMediaQuery", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("미디어쿼리 호출 인자를 확인하여 초기 상태 반영 확인", () => {
		test("미디어쿼리가 일치하지 않으면 false 반환", () => {
			//  jest.setup.ts의 mock이 matches: false로 설정
			const { result } = renderHook(() => useMediaQuery("(min-width: 1280px)"));
			expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1280px)");
			expect(result.current).toBe(false);
		});

		test("미디어쿼리가 일치하면 true 반환", () => {
			window.matchMedia = jest.fn().mockImplementation((query: string) => ({
				matches: true,
				media: query,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			}));

			const { result } = renderHook(() => useMediaQuery("(min-width: 1280px)"));
			expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1280px)");
			expect(result.current).toBe(true);
		});
	});

	describe("미디어쿼리 변경 확인", () => {
		test("change 이벤트 발생 시 최신 matches 값을 반영해 false → true → false로 업데이트된다", () => {
			let currentMatches = false;
			let changeHandler: MatchMediaChangeHandler | undefined;

			window.matchMedia = jest.fn().mockImplementation((query: string) => ({
				get matches() {
					return currentMatches;
				},
				media: query,
				addEventListener: jest.fn((event: string, handler: MatchMediaChangeHandler) => {
					if (event === "change") changeHandler = handler;
				}),
				removeEventListener: jest.fn(),
			}));

			const { result } = renderHook(() => useMediaQuery("(min-width: 1280px)"));
			// 1280 미만인 경우
			expect(result.current).toBe(false);

			// useSyncExternalStore는 change 이벤트 객체를 읽지 않고
			// getSnapshot에서 window.matchMedia를 읽기 때문에 matches 값을 다시 읽어서 전달
			act(() => {
				currentMatches = true;
				changeHandler?.({
					matches: true,
					media: "(min-width: 1280px)",
				});
			});

			// 1280 이상인 경우
			expect(result.current).toBe(true);

			act(() => {
				currentMatches = false;
				changeHandler?.({
					matches: false,
					media: "(min-width: 1280px)",
				});
			});
			// 1280 미만인 경우
			expect(result.current).toBe(false);
		});
	});

	describe("이벤트 리스너 정리", () => {
		test("언마운트 시 change 이벤트 리스너를 제거한다", () => {
			const removeEventListener = jest.fn();
			let changeHandler: (() => void) | undefined;

			window.matchMedia = jest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: jest.fn((event: string, handler: () => void) => {
					if (event === "change") changeHandler = handler;
				}),
				removeEventListener,
			}));

			const { unmount } = renderHook(() => useMediaQuery("(min-width: 1280px)"));

			unmount();

			expect(removeEventListener).toHaveBeenCalledWith("change", changeHandler);
		});
	});
});
