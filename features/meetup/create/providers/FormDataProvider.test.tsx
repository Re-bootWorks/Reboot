import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormDataProvider, { useFormData } from "./FormDataProvider";

function Probe() {
	const { getStepValid, checkAllStepValid, setStepValid } = useFormData();
	return (
		<div>
			<span data-testid="step1">{String(getStepValid(1))}</span>
			<span data-testid="step2">{String(getStepValid(2))}</span>
			<span data-testid="all">{String(checkAllStepValid())}</span>
			<button type="button" onClick={() => setStepValid(1, true)}>
				valid
			</button>
			<button type="button" onClick={() => setStepValid(1, false)}>
				invalid
			</button>
		</div>
	);
}

function setupFormDataProbe() {
	const user = userEvent.setup();
	render(
		<FormDataProvider totalSteps={3}>
			<Probe />
		</FormDataProvider>,
	);
	return user;
}

describe("모임 생성 폼 단계별 유효성 상태 저장 테스트", () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = setupFormDataProbe();
	});

	test("특정 단계를 true로 바꾸면 해당 단계는 true이고 전체 통과는 false", async () => {
		expect(screen.getByTestId("step1")).toHaveTextContent("false");
		await user.click(screen.getByRole("button", { name: "valid" }));
		expect(screen.getByTestId("step1")).toHaveTextContent("true");
		expect(screen.getByTestId("all")).toHaveTextContent("false");
	});

	test("특정 단계 true 후 다시 false로 바꾸면 해당 단계는 false이고 전체 통과는 false", async () => {
		await user.click(screen.getByRole("button", { name: "valid" }));
		await user.click(screen.getByRole("button", { name: "invalid" }));
		expect(screen.getByTestId("step1")).toHaveTextContent("false");
		expect(screen.getByTestId("all")).toHaveTextContent("false");
	});
});
