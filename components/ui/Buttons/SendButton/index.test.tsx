import SendButton from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SendButton 테스트", () => {
	describe("렌더링 검사", () => {
		it("버튼이 렌더링 되는지 확인", () => {
			render(<SendButton />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
		it("아이콘이 렌더링 되는지 확인", () => {
			render(<SendButton />);
			expect(document.querySelector("svg")).toBeInTheDocument();
		});
		it("sizes가 small일 때 버튼이 size-10 클래스를 가진다", () => {
			render(<SendButton sizes="small" />);
			expect(screen.getByRole("button")).toHaveClass("size-10");
		});
	});

	describe("클릭 검사", () => {
		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<SendButton onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
		it("disabled일 때 클릭이 되지 않는다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<SendButton disabled onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
