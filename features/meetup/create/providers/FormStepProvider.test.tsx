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

function setupFormStepProbe(options?: { step?: number; totalSteps?: number }) {
	const user = userEvent.setup();
	render(
		<Suspense fallback={null}>
			<FormStepProvider step={options?.step ?? 1} totalSteps={options?.totalSteps ?? 5}>
				<StepProbe />
			</FormStepProvider>
		</Suspense>,
	);
	return user;
}

describe("모임 생성 폼 단계별 이동 및 주소 변경 테스트", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/");
	});

	test("next 함수 실행 시 브라우저 쿼리 step은 1 증가", async () => {
		window.history.replaceState(null, "", "?step=2");
		const user = setupFormStepProbe();
		expect(screen.getByTestId("current")).toHaveTextContent("2");
		await user.click(screen.getByRole("button", { name: "next" }));
		expect(new URLSearchParams(window.location.search).get("step")).toBe("3");
	});

	test("prev 함수 실행 시 브라우저 쿼리 step은 1 감소", async () => {
		window.history.replaceState(null, "", "?step=2");
		const user = setupFormStepProbe();
		await user.click(screen.getByRole("button", { name: "prev" }));
		expect(new URLSearchParams(window.location.search).get("step")).toBe("1");
	});

	test("step 쿼리가 없을 때 next 함수는 step prop + 1을 브라우저 쿼리에 적용", async () => {
		const user = setupFormStepProbe({ step: 4 });
		expect(screen.getByTestId("current")).toHaveTextContent("4");
		await user.click(screen.getByRole("button", { name: "next" }));
		expect(new URLSearchParams(window.location.search).get("step")).toBe("5");
	});

	test("step 쿼리가 없을 때 prev 함수는 step prop - 1을 브라우저 쿼리에 적용", async () => {
		const user = setupFormStepProbe({ step: 4 });
		expect(screen.getByTestId("current")).toHaveTextContent("4");
		await user.click(screen.getByRole("button", { name: "prev" }));
		expect(new URLSearchParams(window.location.search).get("step")).toBe("3");
	});
});
