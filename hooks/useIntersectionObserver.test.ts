import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

type MockIntersectionEntry = Pick<IntersectionObserverEntry, "isIntersecting" | "target">;
type MockIntersectionCallback = (entries: MockIntersectionEntry[]) => void;

function createEntry(target: Element, isIntersecting: boolean): MockIntersectionEntry {
	return { target, isIntersecting };
}

describe("useIntersectionObserver", () => {
	let intersectionCallback: MockIntersectionCallback;
	let observe: jest.Mock;
	let disconnect: jest.Mock;

	beforeEach(() => {
		observe = jest.fn();
		disconnect = jest.fn();

		globalThis.IntersectionObserver = jest.fn().mockImplementation((callback) => {
			// 브라우저가 실제로 실행해주는 intersection callback을 테스트에서 직접 호출하기 위해 저장
			intersectionCallback = callback;
			return {
				observe, // 감시유무 판단
				disconnect,
			};
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("observer 생성 조건", () => {
		test("isEnabled가 false면 observer를 생성하지 않는다", () => {
			const targetRef = createRef<Element>();
			targetRef.current = document.createElement("div");

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect: jest.fn(),
					isEnabled: false,
				}),
			);

			expect(globalThis.IntersectionObserver).not.toHaveBeenCalled();
			expect(observe).not.toHaveBeenCalled();
		});

		test("targetRef.current가 없으면 observer를 생성하지 않는다", () => {
			const targetRef = createRef<Element>();
			targetRef.current = null;

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect: jest.fn(),
					isEnabled: true,
				}),
			);

			expect(globalThis.IntersectionObserver).not.toHaveBeenCalled();
			expect(observe).not.toHaveBeenCalled();
		});
	});

	describe("observer 등록", () => {
		test("isEnabled가 true이고 targetRef.current가 있으면 observer를 생성한다", () => {
			const target = document.createElement("div");
			const targetRef = createRef<Element>();
			targetRef.current = target;

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect: jest.fn(),
					isEnabled: true,
				}),
			);

			expect(globalThis.IntersectionObserver).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(target);
		});

		test("threshold, root, rootMargin 옵션을 전달해 observer를 생성한다", () => {
			const target = document.createElement("div");
			const root = document.createElement("section");

			const targetRef = createRef<Element>();
			targetRef.current = target;

			const rootRef = createRef<Element>();
			rootRef.current = root;

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					rootRef,
					onIntersect: jest.fn(),
					isEnabled: true,
					threshold: 0.5,
					rootMargin: "100px",
				}),
			);

			// any(Function) 어떤 함수인지 중요하지 않음
			// 함수가 전달됐는지만 보면 될때 사용
			expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
				threshold: 0.5,
				root: root,
				rootMargin: "100px",
			});
		});
	});

	describe("intersection 감지", () => {
		test("isIntersecting이 true면 onIntersect를 호출한다", () => {
			const onIntersect = jest.fn();
			const target = document.createElement("div");
			const targetRef = createRef<Element>();
			targetRef.current = target;

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect,
					isEnabled: true,
				}),
			);
			// 브라우저에서는 요소가 뷰포트에 들어오면 callback이 실행 되지만
			// 테스트에서는 저장해둔 callback을 직접 호출해 해당 상황 재현함
			act(() => intersectionCallback([createEntry(target, true)]));

			expect(onIntersect).toHaveBeenCalledTimes(1);
		});

		test("isIntersecting이 false면 onIntersect를 호출하지 않는다", () => {
			const onIntersect = jest.fn();
			const target = document.createElement("div");
			const targetRef = createRef<Element>();
			targetRef.current = target;

			renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect,
					isEnabled: true,
				}),
			);

			act(() => intersectionCallback([createEntry(target, false)]));

			expect(onIntersect).not.toHaveBeenCalled();
		});
	});

	describe("observer 정리", () => {
		test("언마운트 시 observer를 disconnect 한다", () => {
			const target = document.createElement("div");
			const targetRef = createRef<Element>();
			targetRef.current = target;

			const { unmount } = renderHook(() =>
				useIntersectionObserver({
					targetRef,
					onIntersect: jest.fn(),
					isEnabled: true,
				}),
			);

			unmount();

			expect(disconnect).toHaveBeenCalledTimes(1);
		});
	});
});
