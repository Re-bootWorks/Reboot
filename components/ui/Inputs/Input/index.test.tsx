import Input from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Input 테스트", () => {
	describe("렌더링 검사", () => {
		it("input이 렌더링 되는지 확인", () => {
			render(<Input />);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});
		it("leftIcon, rightIcon이 렌더링 되는지 확인", () => {
			render(
				<Input
					leftIcon={<svg data-testid="left-icon" />}
					rightIcon={<svg data-testid="right-icon" />}
				/>,
			);
			expect(screen.getByTestId("left-icon")).toBeInTheDocument();
			expect(screen.getByTestId("right-icon")).toBeInTheDocument();
		});
		it("isDestructive=true일 때 에러 border 클래스를 가지는지 확인", () => {
			const { container } = render(<Input isDestructive={true} />);
			expect(container.firstChild).toHaveClass("border-error");
		});
		it("onRightIconClick이 있으면 rightIcon이 버튼으로 감싸지는지 확인", () => {
			render(<Input rightIcon={<svg data-testid="right-icon" />} onRightIconClick={() => {}} />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});
	describe("클릭 검사", () => {
		it("onRightIconClick 클릭 시 호출되는지 확인", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<Input rightIcon={<svg />} onRightIconClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("disabled 검사", () => {
		it("disabled=true일 때 opacity-50 클래스를 가지는지 확인", () => {
			const { container } = render(<Input disabled={true} />);
			expect(container.firstChild).toHaveClass("opacity-50");
		});
		it("disabled=true일 때 input이 비활성화 되는지 확인", () => {
			render(<Input disabled={true} />);
			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});
});
