import { renderHook, act } from "@testing-library/react";
import type { PointerEvent, MouseEvent } from "react";
import useDragScroll from "./useDragScroll";

type MockPointerEvent = Pick<PointerEvent<HTMLDivElement>, "button" | "clientX">;
type MockMouseEvent = Pick<MouseEvent, "stopPropagation" | "preventDefault">;

function setup() {
	const { result } = renderHook(() => useDragScroll<HTMLDivElement>());

	// ref.current 직접 주입
	const el = document.createElement("div");
	result.current.ref.current = el;

	// 클릭 이벤트 모킹
	const click: MockMouseEvent = { stopPropagation: jest.fn(), preventDefault: jest.fn() };
	return { result, click };
}

describe("useDragScroll 커스텀 훅 테스트", () => {
	test("초기 overflow 상태에서 left와 right는 모두 false여야 함", () => {
		const { result } = setup();

		expect(result.current.overflow).toEqual({ left: false, right: false });
	});

	test("드래그에서 발생되는 기본 클릭 이벤트는 무효여야 함", () => {
		const { result, click } = setup();

		act(() => {
			const down: MockPointerEvent = { button: 0, clientX: 100 };
			const move: MockPointerEvent = { button: 0, clientX: 110 };
			result.current.onPointerDown(down as PointerEvent<HTMLDivElement>);
			result.current.onPointerMove(move as PointerEvent<HTMLDivElement>);
		});

		result.current.onClickCapture(click as MouseEvent);

		expect(click.stopPropagation).toHaveBeenCalled();
		expect(click.preventDefault).toHaveBeenCalled();
	});

	test("드래그 없이 클릭 시 클릭 이벤트가 실행되어야 함", () => {
		const { result, click } = setup();

		result.current.onClickCapture(click as MouseEvent);

		expect(click.stopPropagation).not.toHaveBeenCalled();
		expect(click.preventDefault).not.toHaveBeenCalled();
	});
});
