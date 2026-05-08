import { renderHook, act } from "@testing-library/react";
import useScrollVisibilityDynamic from "./useScrollVisibilityDynamic";

// rAF 내부 스크롤 판정 함수(flush)를 테스트에서 수동 실행하기 위한 변수
let pendingRaf: FrameRequestCallback | null = null;

// 대기 중인 rAF 콜백을 즉시 실행
function flushRaf() {
	if (pendingRaf) {
		const cb = pendingRaf;
		pendingRaf = null;
		cb(performance.now());
	}
}

// 브라우저 스크롤 시뮬레이션 (위치 변경 => 이벤트 발생 => rAF 실행)
function scrollTo(y: number) {
	Object.defineProperty(window, "scrollY", { value: y, writable: true, configurable: true });
	window.dispatchEvent(new Event("scroll"));
	flushRaf();
}

beforeEach(() => {
	jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
		pendingRaf = cb;
		return 1;
	});
	jest.spyOn(window, "cancelAnimationFrame").mockImplementation(jest.fn());
	jest.spyOn(performance, "now").mockReturnValue(0);
	Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe("useScrollVisibilityDynamic 커스텀 훅 테스트", () => {
	const params = { cooldownMs: 0, collapsePx: 80, revealPx: 40 };

	test("초기 상태는 isVisible가 true, hasPassedTopOffset가 false여야 함", () => {
		const { result } = renderHook(() => useScrollVisibilityDynamic(params));

		act(() => flushRaf());
		expect(result.current.isVisible).toBe(true);
		expect(result.current.hasPassedTopOffset).toBe(false);
	});

	test("topOffset 초과 후 아래로 collapsePx 이상 스크롤 시 isVisible이 false로 전환", () => {
		const { result } = renderHook(() => useScrollVisibilityDynamic(params));

		act(() => flushRaf());
		act(() => scrollTo(170));
		expect(result.current.isVisible).toBe(false);
		expect(result.current.hasPassedTopOffset).toBe(true);
	});

	test("접힌 상태에서 위로 revealPx 이상 스크롤 시 isVisible이 true로 복귀", () => {
		const { result } = renderHook(() => useScrollVisibilityDynamic(params));

		act(() => flushRaf());
		act(() => scrollTo(170));
		expect(result.current.isVisible).toBe(false);

		act(() => scrollTo(130));
		expect(result.current.isVisible).toBe(true);
		expect(result.current.hasPassedTopOffset).toBe(true);
	});
});
