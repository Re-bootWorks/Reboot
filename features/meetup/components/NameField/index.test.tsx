import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NameField from ".";

const placeholderText = "모임 이름을 입력해주세요";

describe("NameField 컴포넌트 테스트", () => {
	const onChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("입력 시 onChange가 (value, event) 형태로 호출되어야 함", async () => {
		const user = userEvent.setup();
		render(<NameField onChange={onChange} />);

		const value = "테스트 모임명";
		const input = screen.getByPlaceholderText(placeholderText);
		await user.type(input, value);

		expect(onChange).toHaveBeenCalledWith(value, expect.any(Object));
	});

	test("isRequired가 false이면 required 속성이 없어야 함", () => {
		render(<NameField onChange={onChange} isRequired={false} />);

		const input = screen.getByPlaceholderText(placeholderText);
		expect(input).not.toBeRequired();
	});

	test("커스텀 name이 input에 적용되어야 함", () => {
		const name = "customName";
		render(<NameField name={name} onChange={onChange} />);

		const input = screen.getByPlaceholderText(placeholderText);
		expect(input).toHaveAttribute("name", name);
	});
});
