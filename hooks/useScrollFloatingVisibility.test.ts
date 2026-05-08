import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import useScrollFloatingVisibility from "./useScrollFloatingVisibility";

type ScrollTarget = Window | HTMLElement;

const originalScrollYDescriptor = Object.getOwnPropertyDescriptor(window, "scrollY");
const originalPageYOffsetDescriptor = Object.getOwnPropertyDescriptor(window, "pageYOffset");

function setWindowScroll(value: number) {
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
}

function restoreWindowScrollProperties() {
	if (originalScrollYDescriptor) {
		Object.defineProperty(window, "scrollY", originalScrollYDescriptor);
	} else {
		Reflect.deleteProperty(window, "scrollY");
	}

	if (originalPageYOffsetDescriptor) {
		Object.defineProperty(window, "pageYOffset", originalPageYOffsetDescriptor);
	} else {
		Reflect.deleteProperty(window, "pageYOffset");
	}
}

function setElementScroll(target: HTMLElement, value: number) {
	Object.defineProperty(target, "scrollTop", {
		value,
		configurable: true,
		writable: true,
	});
}

function fireScroll(target: ScrollTarget = window) {
	target.dispatchEvent(new Event("scroll"));
}

function createRect(top: number): DOMRect {
	return {
		top,
		bottom: top + 10,
		left: 0,
		right: 0,
		width: 100,
		height: 10,
		x: 0,
		y: top,
		toJSON: () => ({}),
	} as DOMRect;
}

describe("useScrollFloatingVisibility", () => {
	let rafQueue: Array<{ id: number; callback: FrameRequestCallback }>;
	let nextFrameId: number;

	function runAnimationFrame() {
		const frame = rafQueue.shift();

		act(() => {
			frame?.callback(0);
		});
	}

	beforeEach(() => {
		rafQueue = [];
		nextFrameId = 1;

		jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((callback: FrameRequestCallback) => {
				const frame = { id: nextFrameId, callback };
				rafQueue.push(frame);
				nextFrameId += 1;
				return frame.id;
			});
		jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
		restoreWindowScrollProperties();
	});

	test("threshold 기준 초기 상태를 계산한다", () => {
		setWindowScroll(0);
		const belowThreshold = renderHook(() => useScrollFloatingVisibility({ threshold: 100 }));
		runAnimationFrame();

		expect(belowThreshold.result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});

		belowThreshold.unmount();

		setWindowScroll(150);
		const aboveThreshold = renderHook(() => useScrollFloatingVisibility({ threshold: 100 }));
		runAnimationFrame();

		expect(aboveThreshold.result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});
	});

	test("기준 지점 이전에는 항상 노출된다", () => {
		setWindowScroll(0);

		const { result } = renderHook(() => useScrollFloatingVisibility({ threshold: 100 }));
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});

		act(() => {
			setWindowScroll(90);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});
	});

	test("기준 지점을 처음 지난 뒤 아래로 스크롤하면 숨기고 위로 스크롤하면 다시 노출한다", () => {
		setWindowScroll(0);

		const { result } = renderHook(() => useScrollFloatingVisibility({ threshold: 100 }));
		runAnimationFrame();

		act(() => {
			setWindowScroll(120);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});

		act(() => {
			setWindowScroll(105);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: true,
		});
	});

	test("delta 미만의 미세 스크롤은 노출 상태를 바꾸지 않는다", () => {
		setWindowScroll(0);

		const { result } = renderHook(() =>
			useScrollFloatingVisibility({
				threshold: 100,
				delta: 10,
			}),
		);
		runAnimationFrame();

		act(() => {
			setWindowScroll(140);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});

		act(() => {
			setWindowScroll(135);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});
	});

	test("triggerRef 기준으로 hasPassedThreshold와 노출 상태를 계산한다", () => {
		const trigger = document.createElement("div");
		const triggerRef = createRef<HTMLElement>();
		triggerRef.current = trigger;

		let top = 30;
		jest.spyOn(trigger, "getBoundingClientRect").mockImplementation(() => createRect(top));

		setWindowScroll(20);
		const { result } = renderHook(() =>
			useScrollFloatingVisibility({
				offset: 0,
				triggerRef,
			}),
		);
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});

		act(() => {
			top = -5;
			setWindowScroll(40);
			fireScroll();
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});
	});

	test("targetRef가 있으면 해당 스크롤 컨테이너 기준으로만 동작한다", () => {
		const container = document.createElement("div");
		const targetRef = createRef<HTMLElement>();
		targetRef.current = container;

		setWindowScroll(0);
		setElementScroll(container, 0);

		const { result } = renderHook(() =>
			useScrollFloatingVisibility({
				threshold: 100,
				targetRef,
			}),
		);
		runAnimationFrame();

		act(() => {
			setWindowScroll(300);
			fireScroll(window);
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});

		act(() => {
			setElementScroll(container, 150);
			fireScroll(container);
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});
	});

	test("resize 이벤트가 발생하면 triggerRef 위치 변화를 반영한다", () => {
		const trigger = document.createElement("div");
		const triggerRef = createRef<HTMLElement>();
		triggerRef.current = trigger;

		let top = 20;
		jest.spyOn(trigger, "getBoundingClientRect").mockImplementation(() => createRect(top));

		setWindowScroll(10);
		const { result } = renderHook(() =>
			useScrollFloatingVisibility({
				offset: 0,
				triggerRef,
			}),
		);
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: true,
			hasPassedThreshold: false,
		});

		act(() => {
			top = -10;
			window.dispatchEvent(new Event("resize"));
		});
		runAnimationFrame();

		expect(result.current).toEqual({
			isVisible: false,
			hasPassedThreshold: true,
		});
	});

	test("언마운트 시 window 이벤트 리스너와 예약된 animation frame을 정리한다", () => {
		setWindowScroll(0);

		const addSpy = jest.spyOn(window, "addEventListener");
		const removeSpy = jest.spyOn(window, "removeEventListener");

		const { unmount } = renderHook(() => useScrollFloatingVisibility({ threshold: 100 }));

		expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
		expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));

		unmount();

		expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
		expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
	});

	test("언마운트 시 targetRef의 scroll 이벤트 리스너를 제거한다", () => {
		const container = document.createElement("div");
		const targetRef = createRef<HTMLElement>();
		targetRef.current = container;

		const addSpy = jest.spyOn(container, "addEventListener");
		const removeSpy = jest.spyOn(container, "removeEventListener");

		const { unmount } = renderHook(() =>
			useScrollFloatingVisibility({
				threshold: 100,
				targetRef,
			}),
		);

		expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
	});
});
