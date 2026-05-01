import { act, renderHook } from "@testing-library/react";
import { useExpandableText } from "./useExpandableText";

type WritableRef<T> = {
	current: T;
};

function setElementHeights(
	element: HTMLDivElement,
	{ scrollHeight, clientHeight }: { scrollHeight: number; clientHeight: number },
) {
	Object.defineProperty(element, "scrollHeight", {
		value: scrollHeight,
		configurable: true,
	});

	Object.defineProperty(element, "clientHeight", {
		value: clientHeight,
		configurable: true,
	});
}

function attachMeasuredElement(
	ref: WritableRef<HTMLDivElement | null>,
	heights: { scrollHeight: number; clientHeight: number },
) {
	const element = document.createElement("div");

	setElementHeights(element, heights);
	ref.current = element;

	return element;
}

describe("useExpandableText", () => {
	const originalResizeObserver = global.ResizeObserver;

	let resizeObserverCallback: ResizeObserverCallback = () => undefined;
	let observe: jest.Mock;
	let disconnect: jest.Mock;

	beforeEach(() => {
		resizeObserverCallback = () => undefined;
		observe = jest.fn();
		disconnect = jest.fn();

		global.ResizeObserver = jest.fn().mockImplementation((callback: ResizeObserverCallback) => {
			resizeObserverCallback = callback;

			return {
				observe,
				unobserve: jest.fn(),
				disconnect,
			};
		}) as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		jest.restoreAllMocks();

		if (originalResizeObserver) {
			global.ResizeObserver = originalResizeObserver;
		} else {
			delete (global as Partial<typeof globalThis>).ResizeObserver;
		}
	});

	test("scrollHeight가 clientHeight + 1을 초과할 때만 overflow를 true로 판단한다", () => {
		const { result, rerender } = renderHook(
			({ content }) => useExpandableText<HTMLDivElement>({ content }),
			{ initialProps: { content: "first" } },
		);

		const contentRef = result.current.contentRef as WritableRef<HTMLDivElement | null>;

		const element = attachMeasuredElement(contentRef, {
			scrollHeight: 101,
			clientHeight: 100,
		});

		rerender({ content: "second" });

		expect(result.current.isOverflow).toBe(false);

		setElementHeights(element, {
			scrollHeight: 102,
			clientHeight: 100,
		});

		rerender({ content: "third" });

		expect(result.current.isOverflow).toBe(true);
		expect(observe).toHaveBeenCalledWith(element);
	});

	test("toggleExpanded를 호출하면 펼침 상태가 토글된다", () => {
		const { result } = renderHook(() => useExpandableText<HTMLDivElement>({ content: "body" }));

		expect(result.current.isExpanded).toBe(false);

		act(() => {
			result.current.toggleExpanded();
		});

		expect(result.current.isExpanded).toBe(true);

		act(() => {
			result.current.toggleExpanded();
		});

		expect(result.current.isExpanded).toBe(false);
	});

	test("접힌 상태에서는 ResizeObserver가 overflow를 다시 계산한다", () => {
		const { result, rerender } = renderHook(
			({ content }) => useExpandableText<HTMLDivElement>({ content }),
			{ initialProps: { content: "first" } },
		);

		const contentRef = result.current.contentRef as WritableRef<HTMLDivElement | null>;

		const element = attachMeasuredElement(contentRef, {
			scrollHeight: 100,
			clientHeight: 100,
		});

		rerender({ content: "second" });

		expect(result.current.isOverflow).toBe(false);

		setElementHeights(element, {
			scrollHeight: 140,
			clientHeight: 100,
		});

		act(() => {
			resizeObserverCallback([] as ResizeObserverEntry[], {} as ResizeObserver);
		});

		expect(result.current.isOverflow).toBe(true);
	});

	test("펼친 상태에서는 ResizeObserver가 overflow를 다시 계산하지 않는다", () => {
		const { result, rerender } = renderHook(
			({ content }) => useExpandableText<HTMLDivElement>({ content }),
			{ initialProps: { content: "first" } },
		);

		const contentRef = result.current.contentRef as WritableRef<HTMLDivElement | null>;

		const element = attachMeasuredElement(contentRef, {
			scrollHeight: 100,
			clientHeight: 100,
		});

		rerender({ content: "second" });

		expect(result.current.isOverflow).toBe(false);

		act(() => {
			result.current.toggleExpanded();
		});

		setElementHeights(element, {
			scrollHeight: 140,
			clientHeight: 100,
		});

		act(() => {
			resizeObserverCallback([] as ResizeObserverEntry[], {} as ResizeObserver);
		});

		expect(result.current.isExpanded).toBe(true);
		expect(result.current.isOverflow).toBe(false);
	});

	test("언마운트 시 ResizeObserver를 disconnect 한다", () => {
		const { result, rerender, unmount } = renderHook(
			({ content }) => useExpandableText<HTMLDivElement>({ content }),
			{ initialProps: { content: "first" } },
		);

		const contentRef = result.current.contentRef as WritableRef<HTMLDivElement | null>;

		attachMeasuredElement(contentRef, {
			scrollHeight: 100,
			clientHeight: 100,
		});

		rerender({ content: "second" });

		unmount();

		expect(disconnect).toHaveBeenCalled();
	});
});
