import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormStepProvider, { useFormStep } from "./FormStepProvider";

jest.mock("next/navigation", () => ({
	useSearchParams: () => new URLSearchParams(window.location.search),
}));

function StepProbe() {
	const { currentStep, next, prev } = useFormStep();
	return (
		<div>
			<span data-testid="current">{currentStep}</span>
			<button type="button" onClick={next}>
				next
			</button>
			<button type="button" onClick={prev}>
				prev
			</button>
		</div>
	);
}

const totalSteps = 5;
function setupFormStepProbe(options?: { step?: number; totalSteps?: number }) {
	const user = userEvent.setup();
	let key = 0;
	const buildUi = () => (
		<Suspense fallback={null} key={key}>
			<FormStepProvider step={options?.step ?? 1} totalSteps={options?.totalSteps ?? totalSteps}>
				<StepProbe />
			</FormStepProvider>
		</Suspense>
	);
	const view = render(buildUi());
	// key를 사용한 리렌더링 트리거
	const rerender = () => {
		key++;
		view.rerender(buildUi());
	};
	return { ...view, user, rerender };
}

describe("모임 생성 폼 단계별 이동 및 주소 변경 테스트", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/");
	});

	test("next 함수 실행 시 step은 1 증가", async () => {
		window.history.replaceState(null, "", "?step=2");
		const { user, rerender } = setupFormStepProbe();
		expect(screen.getByTestId("current")).toHaveTextContent("2");

		await user.click(screen.getByRole("button", { name: "next" }));
		rerender();
		expect(screen.getByTestId("current")).toHaveTextContent("3");
		expect(new URLSearchParams(window.location.search).get("step")).toBe("3");
	});

	test("prev 함수 실행 시 step은 1 감소", async () => {
		window.history.replaceState(null, "", "?step=2");
		const { user, rerender } = setupFormStepProbe();

		await user.click(screen.getByRole("button", { name: "prev" }));
		rerender();
		expect(screen.getByTestId("current")).toHaveTextContent("1");
		expect(new URLSearchParams(window.location.search).get("step")).toBe("1");
	});

	test("step 쿼리가 없을 때 next 함수는 step prop + 1을 step에 적용", async () => {
		const { user, rerender } = setupFormStepProbe({ step: 4 });
		expect(screen.getByTestId("current")).toHaveTextContent("4");

		await user.click(screen.getByRole("button", { name: "next" }));
		rerender();
		expect(screen.getByTestId("current")).toHaveTextContent("5");
		expect(new URLSearchParams(window.location.search).get("step")).toBe("5");
	});

	test("step 쿼리가 없을 때 prev 함수는 step prop - 1을 step에 적용", async () => {
		const { user, rerender } = setupFormStepProbe({ step: 4 });
		expect(screen.getByTestId("current")).toHaveTextContent("4");

		await user.click(screen.getByRole("button", { name: "prev" }));
		rerender();
		expect(screen.getByTestId("current")).toHaveTextContent("3");
		expect(new URLSearchParams(window.location.search).get("step")).toBe("3");
	});

	test("마지막 단계에서 next 함수 실행 시 step은 totalSteps 값과 동일해야 함", async () => {
		window.history.replaceState(null, "", "?step=5");
		const { user, rerender } = setupFormStepProbe();

		// 아래 동작이 실행되어도 step 쿼리 값은 그대로여야 함
		await user.click(screen.getByRole("button", { name: "next" }));
		rerender();
		expect(screen.getByTestId("current")).toHaveTextContent("5");
		expect(new URLSearchParams(window.location.search).get("step")).toBe("5");
	});
});
