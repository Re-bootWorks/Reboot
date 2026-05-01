import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import type { MutableRefObject } from "react";
import useScrollOnNextQueryChange from "./useScrollOnNextQueryChange";

jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
}));

function attachScrollAnchor(ref: MutableRefObject<HTMLDivElement | null>) {
	const anchor = document.createElement("div");
	const scrollIntoView = jest.fn();

	Object.defineProperty(anchor, "scrollIntoView", {
		value: scrollIntoView,
		configurable: true,
	});

	ref.current = anchor;

	return scrollIntoView;
}

describe("useScrollOnNextQueryChange", () => {
	let currentQuery = "page=1";

	beforeEach(() => {
		currentQuery = "page=1";
		jest
			.mocked(useSearchParams)
			.mockImplementation(
				() => new URLSearchParams(currentQuery) as ReturnType<typeof useSearchParams>,
			);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("최초 마운트 시에는 스크롤하지 않는다", () => {
		const { result } = renderHook(() => useScrollOnNextQueryChange<HTMLDivElement>());
		const scrollIntoView = attachScrollAnchor(
			result.current.scrollAnchorRef as MutableRefObject<HTMLDivElement | null>,
		);

		expect(scrollIntoView).not.toHaveBeenCalled();
	});

	test("markWillChange 없이 query가 바뀌면 스크롤하지 않는다", () => {
		const { result, rerender } = renderHook(() => useScrollOnNextQueryChange<HTMLDivElement>());
		const scrollIntoView = attachScrollAnchor(
			result.current.scrollAnchorRef as MutableRefObject<HTMLDivElement | null>,
		);

		currentQuery = "page=2";
		rerender();

		expect(scrollIntoView).not.toHaveBeenCalled();
	});

	test("markWillChange 후 query가 변경되면 한 번만 지정한 behavior로 스크롤한다", () => {
		const { result, rerender } = renderHook(() =>
			useScrollOnNextQueryChange<HTMLDivElement>({
				behavior: "smooth",
			}),
		);
		const scrollIntoView = attachScrollAnchor(
			result.current.scrollAnchorRef as MutableRefObject<HTMLDivElement | null>,
		);

		act(() => {
			result.current.markWillChange();
		});

		currentQuery = "page=2";
		rerender();

		expect(scrollIntoView).toHaveBeenCalledTimes(1);
		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "start",
		});

		currentQuery = "page=3";
		rerender();

		expect(scrollIntoView).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.markWillChange();
		});

		currentQuery = "page=4";
		rerender();

		expect(scrollIntoView).toHaveBeenCalledTimes(2);
	});
});
