import EditButton from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("EditButton 테스트", () => {
	describe("렌더링 검사", () => {
		it("버튼이 렌더링 되는지 확인", () => {
			render(<EditButton />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
		it("아이콘이 렌더링 되는지 확인", () => {
			render(<EditButton />);
			expect(document.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("클릭 검사", () => {
		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<EditButton onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
		it("disabled일 때 클릭이 되지 않는다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<EditButton disabled onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
