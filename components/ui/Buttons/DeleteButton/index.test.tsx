import DeleteButton from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DeleteButton 테스트", () => {
	describe("렌더링 검사", () => {
		it("버튼이 렌더링 되는지 확인", () => {
			render(<DeleteButton />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
		it("아이콘이 렌더링 되는지 확인", () => {
			render(<DeleteButton />);
			expect(document.querySelector("svg")).toBeInTheDocument();
		});
		it("iconSize가 xxs일 때 svg 크기가 16이다", () => {
			render(<DeleteButton iconSize="xxs" />);
			const svg = document.querySelector("svg");
			expect(svg).toHaveAttribute("width", "16");
		});
	});

	describe("클릭 검사", () => {
		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<DeleteButton onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
		it("disabled일 때 클릭이 되지 않는다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<DeleteButton disabled onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
