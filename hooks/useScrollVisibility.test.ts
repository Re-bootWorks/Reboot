import { act, renderHook } from "@testing-library/react";
import useScrollVisibility from "./useScrollVisibility";
import { createRef } from "react";

type Target = Window | HTMLElement;

function setScroll(value: number, target: Target = window) {
	if (target === window) {
		Object.defineProperty(window, "scrollY", {
			value,
			configurable: true,
			writable: true,
		});
		Object.defineProperty(window, "pageYOffset", {
			value,
			configurable: true,
			writable: true,
		});
		return;
	}

	Object.defineProperty(target, "scrollTop", {
		value,
		configurable: true,
		writable: true,
	});
}

function fireScrollEvent(target: Target = window) {
	target.dispatchEvent(new Event("scroll"));
}

describe("useScrollVisibility", () => {
	let rafCallback: FrameRequestCallback | null = null;

	function runAnimationFrame() {
		// useScrollVisibility는 scroll 이벤트 직후 바로 상태를 바꾸지 않고
		// requestAnimationFrame 안에서 updateScroll을 실행함
		// 테스트에서는 rAF가 자동 실행되지 않으므로 직접 실행해 상태 갱신 시점을 제어

		// jsdom 에서 Object.defineProperty 가 동기 흐름 중 반영이 안되는 문제 해결을 위해 실행 함수 추가
		act(() => {
			rafCallback?.(0);
		});
	}
	beforeEach(() => {
		rafCallback = null;
		jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((callback: FrameRequestCallback) => {
				// 즉시 실행하면 훅 내부의 ticking 플래그 흐름이 꼬일 수 있어
				// callback만 저장해두고 각 테스트에서 runRaf()로 수동 실행
				rafCallback = callback;
				return 1; // frameId 반환
			});
		// handleScroll에서  rAF 예약 후 true -> updateScroll 에서 실행 완료후 다시 false로 리셋하는 흐름 모킹

		jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("초기값 확인", () => {
		test("초기 scroll 위치가 threshold 이하일 때 false다", () => {
			setScroll(0);

			const { result } = renderHook(() => useScrollVisibility());
			runAnimationFrame();

			expect(result.current).toBe(false);
		});

		test("인자 없이 호출하면 threshold 기본값 100이 적용된다", () => {
			setScroll(101);

			const { result } = renderHook(() => useScrollVisibility());
			runAnimationFrame();

			expect(result.current).toBe(true);
		});

		test("scrollY가 threshold와 정확히 같으면 false다", () => {
			setScroll(100);

			const { result } = renderHook(() => useScrollVisibility({ threshold: 100 }));
			runAnimationFrame();

			expect(result.current).toBe(false); // currentScroll > threshold
		});
	});

	describe("window 스크롤 기준", () => {
		test("스크롤 이동시 false → true → false로 변경된다", () => {
			setScroll(0);

			const { result } = renderHook(() => useScrollVisibility());

			runAnimationFrame();
			expect(result.current).toBe(false);

			act(() => {
				setScroll(200);
				fireScrollEvent();
			});
			runAnimationFrame();

			expect(result.current).toBe(true);

			act(() => {
				setScroll(50);
				fireScrollEvent();
			});
			runAnimationFrame();

			expect(result.current).toBe(false);
		});
	});

	describe("targetRef 스크롤 기준", () => {
		test("targetRef 요소의 scrollTop이 threshold를 초과하면 true가 된다", () => {
			const container = document.createElement("div");
			const targetRef = createRef<HTMLElement>();
			targetRef.current = container;

			setScroll(150, container);

			const { result } = renderHook(() => useScrollVisibility({ threshold: 100, targetRef }));

			runAnimationFrame();

			expect(result.current).toBe(true);
		});

		test("targetRef가 있으면 target 요소에 scroll 이벤트를 등록한다", () => {
			const container = document.createElement("div");
			const addSpy = jest.spyOn(container, "addEventListener");
			const targetRef = createRef<HTMLElement>();
			targetRef.current = container;

			renderHook(() => useScrollVisibility({ threshold: 100, targetRef }));

			expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), {
				passive: true,
			});
		});

		test("targetRef가 있으면 window scroll 이벤트는 무시한다", () => {
			const container = document.createElement("div");
			const targetRef = createRef<HTMLElement>();
			targetRef.current = container;

			setScroll(100, container); // threshold와 동일하므로 false 상태 유지
			const { result } = renderHook(() => useScrollVisibility({ threshold: 100, targetRef }));
			runAnimationFrame();

			act(() => {
				setScroll(500, window);
				fireScrollEvent(window);
			});
			runAnimationFrame();

			expect(result.current).toBe(false);
		});
	});

	describe("이벤트 리스너 정리", () => {
		test("언마운트 시 window scroll 이벤트 리스너를 제거한다", () => {
			const addSpy = jest.spyOn(window, "addEventListener");
			const removeSpy = jest.spyOn(window, "removeEventListener");

			const { unmount } = renderHook(() => useScrollVisibility());

			expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });

			unmount();

			expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
		});
		test("언마운트 시 targetRef의 scroll 이벤트 리스너를 제거한다", () => {
			const container = document.createElement("div");
			const addSpy = jest.spyOn(container, "addEventListener");
			const removeSpy = jest.spyOn(container, "removeEventListener");
			const targetRef = createRef<HTMLElement>();
			targetRef.current = container;

			const { unmount } = renderHook(() => useScrollVisibility({ threshold: 100, targetRef }));

			expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });

			unmount();

			expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
		});
	});
});

// requestAnimationFrame 기반으로 동작하는 훅이므로 scroll 이벤트 후 runAnimationFrame()로 상태 갱신을 직접 실행
