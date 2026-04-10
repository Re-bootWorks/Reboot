import SocialButton from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SocialButton 테스트", () => {
	describe("렌더링 검사", () => {
		it("버튼이 렌더링 되는지 확인", () => {
			render(<SocialButton social="Kakao" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
		it("children이 렌더링 되는지 확인", () => {
			render(<SocialButton social="Kakao">버튼내용</SocialButton>);
			expect(screen.getByText("버튼내용")).toBeInTheDocument();
		});
	});
	describe("social prop 검사", () => {
		it("Kakao일 때 아이콘과 스타일 클래스를 가진다", () => {
			render(<SocialButton social="Kakao" />);
			expect(document.querySelector("svg")).toBeInTheDocument();
			expect(screen.getByRole("button")).toHaveClass("bg-kakao-bg");
		});

		it("Google일 때 아이콘과 스타일 클래스를 가진다", () => {
			render(<SocialButton social="Google" />);
			expect(document.querySelector("svg")).toBeInTheDocument();
			expect(screen.getByRole("button")).toHaveClass("bg-white");
		});
	});

	describe("클릭 검사", () => {
		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<SocialButton social="Kakao" onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
		it("disabled일 때 클릭이 되지 않는다", async () => {
			const user = userEvent.setup();
			const handleClick = jest.fn();
			render(<SocialButton social="Kakao" disabled onClick={handleClick} />);

			const button = screen.getByRole("button");
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
