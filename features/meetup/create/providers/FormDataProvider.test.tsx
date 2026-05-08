import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormDataProvider, { useFormData } from "./FormDataProvider";

const testIdStep1 = "step1";
const testIdStep2 = "step2";
const testIdStep3 = "step3";
const testIdAll = "all";
const testIdValid1 = "valid1";
const testIdValid2 = "valid2";
const testIdValid3 = "valid3";
const testIdInvalid1 = "invalid1";

function Probe() {
	const { getStepValid, checkAllStepValid, setStepValid } = useFormData();
	return (
		<div>
			<span data-testid={testIdStep1}>{String(getStepValid(1))}</span>
			<span data-testid={testIdStep2}>{String(getStepValid(2))}</span>
			<span data-testid={testIdStep3}>{String(getStepValid(3))}</span>
			<span data-testid={testIdAll}>{String(checkAllStepValid())}</span>
			<button type="button" data-testid={testIdValid1} onClick={() => setStepValid(1, true)} />
			<button type="button" data-testid={testIdValid2} onClick={() => setStepValid(2, true)} />
			<button type="button" data-testid={testIdValid3} onClick={() => setStepValid(3, true)} />
			<button type="button" data-testid={testIdInvalid1} onClick={() => setStepValid(1, false)} />
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
		expect(screen.getByTestId(testIdStep1)).toHaveTextContent("false");
		await user.click(screen.getByTestId(testIdValid1));
		expect(screen.getByTestId(testIdStep1)).toHaveTextContent("true");
		expect(screen.getByTestId(testIdAll)).toHaveTextContent("false");
	});

	test("특정 단계 true 후 다시 false로 바꾸면 해당 단계는 false이고 전체 통과는 false", async () => {
		await user.click(screen.getByTestId(testIdValid1));
		await user.click(screen.getByTestId(testIdInvalid1));
		expect(screen.getByTestId(testIdStep1)).toHaveTextContent("false");
		expect(screen.getByTestId(testIdAll)).toHaveTextContent("false");
	});

	test("모든 단계가 통과하면 전체 통과는 true", async () => {
		await user.click(screen.getByTestId(testIdValid1));
		await user.click(screen.getByTestId(testIdValid2));
		await user.click(screen.getByTestId(testIdValid3));
		expect(screen.getByTestId(testIdStep1)).toHaveTextContent("true");
		expect(screen.getByTestId(testIdStep2)).toHaveTextContent("true");
		expect(screen.getByTestId(testIdStep3)).toHaveTextContent("true");
		expect(screen.getByTestId(testIdAll)).toHaveTextContent("true");
	});
});
