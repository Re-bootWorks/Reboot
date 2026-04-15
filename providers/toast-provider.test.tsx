import { act, render, screen } from "@testing-library/react";
import { ToastProvider, useToast } from "./toast-provider";
import userEvent from "@testing-library/user-event";
// 애니메이션 타이밍으로 인한 flaky 테스트를 막기 위해 motion/react를 단순 mock으로 대체
// motion 전용 props는 일반 div에 전달되면 React 경고가 발생하므로 제거
jest.mock("motion/react", () => {
	const actual = jest.requireActual("motion/react");
	return {
		...actual,
		AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		motion: {
			div: ({
				children,
				layout,
				...props
			}: React.HTMLAttributes<HTMLDivElement> & {
				layout?: boolean;
			}) => <div {...props}>{children}</div>,
		},
	};
});

function TestComponent() {
	const { handleShowToast } = useToast();

	return (
		<>
			<button
				type="button"
				onClick={() =>
					handleShowToast({ message: "로그인에 성공했습니다", status: "success", duration: 1000 })
				}>
				성공 토스트 버튼
			</button>

			<button
				type="button"
				onClick={() =>
					handleShowToast({ message: "로그인에 실패했습니다", status: "error", duration: 1000 })
				}>
				실패 토스트 버튼
			</button>
		</>
	);
}

function renderTestComponent() {
	return render(
		<ToastProvider>
			<TestComponent />
		</ToastProvider>,
	);
}

describe("ToastProvider", () => {
	test("handleShowToast 호출 시 toast가 렌더링된다", async () => {
		renderTestComponent();
		const user = userEvent.setup();

		const successBtn = screen.getByRole("button", { name: "성공 토스트 버튼" });
		await user.click(successBtn);
		// Toast는 mounted 이후 portal로 렌더링되므로 비동기 쿼리로 확인한다.
		const successToast = await screen.findByText("로그인에 성공했습니다");
		expect(successToast).toBeInTheDocument();

		const errorBtn = screen.getByRole("button", { name: "실패 토스트 버튼" });
		await user.click(errorBtn);
		const errorToast = await screen.findByText("로그인에 실패했습니다");
		expect(errorToast).toBeInTheDocument();
	});

	test("duration 이후 toast가 제거된다", async () => {
		// setTimeout 사용시 fake timer로 가짜 타이머 생성
		jest.useFakeTimers();
		renderTestComponent();
		// userEvent도 fake timer 사용할 수 있도록 advanceTimers 연결
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

		const successBtn = screen.getByRole("button", { name: "성공 토스트 버튼" });
		await user.click(successBtn);
		const successToast = await screen.findByText("로그인에 성공했습니다");
		expect(successToast).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(1000); // duration 만큼 강제로 시간 흐르게 함
		});

		expect(screen.queryByText("로그인에 성공했습니다")).not.toBeInTheDocument();

		jest.useRealTimers(); // 실제 타이머 복구
	});
});
