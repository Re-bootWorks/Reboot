import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CapacityField from ".";

const placeholderText = "숫자만 입력해주세요";

describe("CapacityField 컴포넌트 테스트", () => {
	const onChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("커스텀 name이 input에 적용되어야 함", () => {
		const name = "customName";
		render(<CapacityField name={name} onChange={onChange} />);

		const input = screen.getByPlaceholderText(placeholderText);
		expect(input).toHaveAttribute("name", name);
	});

	test("입력된 값이 양수일 때 input에 표시되어야 함", () => {
		const value = 5;
		render(<CapacityField value={value} onChange={onChange} />);

		expect(screen.getByDisplayValue(value.toString())).toBeInTheDocument();
	});

	test("value가 0 이하이면 빈 값으로 표시되어야 함", () => {
		const value = 0;
		render(<CapacityField value={value} onChange={onChange} />);

		const input = screen.getByPlaceholderText(placeholderText);
		expect(input).toHaveValue(null);
	});

	test("입력 시 onChange가 (number, event) 형태로 호출되어야 함", async () => {
		const user = userEvent.setup();
		render(<CapacityField onChange={onChange} />);

		const input = screen.getByPlaceholderText(placeholderText);
		await user.type(input, "10");

		expect(onChange).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
	});

	test("isRequired가 false이면 required 속성이 없어야 함", () => {
		render(<CapacityField onChange={onChange} isRequired={false} />);

		const input = screen.getByPlaceholderText(placeholderText);
		expect(input).not.toBeRequired();
	});
});
