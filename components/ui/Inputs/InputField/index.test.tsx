import InputField from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("InputField 테스트", () => {
	describe("렌더링 검사", () => {
		it("input이 렌더링 되는지 확인", () => {
			render(<InputField />);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});
		it("label이 렌더링 되는지 확인", () => {
			render(<InputField label="라벨내용" />);
			expect(screen.getByText("라벨내용")).toBeInTheDocument();
		});
		it("label과 input이 연결되는지 확인", () => {
			render(<InputField label="라벨내용" />);
			expect(screen.getByRole("textbox", { name: "라벨내용" })).toBeInTheDocument();
		});
		it("isRequired=true일 때 * 이 표시되는지 확인", () => {
			render(<InputField label="test" isRequired={true} />);
			expect(screen.getByText("*")).toBeInTheDocument();
		});
		it("hintText가 렌더링 되는지 확인", () => {
			render(<InputField hintText="힌트텍스트내용" />);
			expect(screen.getByText("힌트텍스트내용")).toBeInTheDocument();
		});
		it("isDestructive=true일 때 hintText가 에러 색상 클래스를 가지는지 확인", () => {
			render(<InputField isDestructive={true} hintText="힌트텍스트내용" />);
			expect(screen.getByText("힌트텍스트내용")).toHaveClass("text-error");
		});
	});
});
