import AuthFormContainer from ".";
import { render, screen } from "@testing-library/react";

describe("AuthFormContainer 테스트", () => {
	describe("렌더링 검사", () => {
		beforeEach(() => {
			render(
				<AuthFormContainer title="타이틀내용" footer={<span>푸터내용</span>}>
					내용
				</AuthFormContainer>,
			);
		});

		it("title이 렌더링 되는지 확인", () => {
			expect(screen.getByText("타이틀내용")).toBeInTheDocument();
		});
		it("children이 렌더링 되는지 확인", () => {
			expect(screen.getByText("내용")).toBeInTheDocument();
		});
		it("footer가 렌더링 되는지 확인", () => {
			expect(screen.getByText("푸터내용")).toBeInTheDocument();
		});
	});
});
