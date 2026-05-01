import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DescField from ".";

const placeholderText = "모임을 설명해주세요";

describe("DescField 컴포넌트 테스트", () => {
	const onChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("입력 시 onChange가 (value, event) 형태로 호출되어야 함", async () => {
		const user = userEvent.setup();
		render(<DescField onChange={onChange} />);

		const value = "테스트 설명";
		const textarea = screen.getByPlaceholderText(placeholderText);
		await user.type(textarea, value);

		expect(onChange).toHaveBeenCalledWith(value, expect.any(Object));
	});

	test("isRequired가 false이면 required 속성이 없어야 함", () => {
		render(<DescField onChange={onChange} isRequired={false} />);

		const textarea = screen.getByPlaceholderText(placeholderText);
		expect(textarea).not.toBeRequired();
	});

	test("커스텀 name이 textarea에 적용되어야 함", () => {
		const name = "customDesc";
		render(<DescField name={name} onChange={onChange} />);

		const textarea = screen.getByPlaceholderText(placeholderText);
		expect(textarea).toHaveAttribute("name", name);
	});
});
