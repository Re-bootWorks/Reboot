import { Modal } from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Modal 테스트", () => {
	describe("렌더링 검사", () => {
		it("isOpen=true일 때 모달과 children이 렌더링 되는지 확인", () => {
			render(
				<Modal isOpen={true} onClose={jest.fn()}>
					모달내용
				</Modal>,
			);
			expect(screen.getByText("모달내용")).toBeInTheDocument();
		});
		it("isOpen=false일 때 모달이 렌더링 되지 않는지 확인", () => {
			render(
				<Modal isOpen={false} onClose={jest.fn()}>
					모달내용
				</Modal>,
			);
			expect(screen.queryByText("모달내용")).not.toBeInTheDocument();
		});
		it("title이 렌더링 되는지 확인", () => {
			render(
				<Modal isOpen={true} onClose={jest.fn()} title={"타이틀내용"}>
					모달내용
				</Modal>,
			);
			expect(screen.queryByText("타이틀내용")).toBeInTheDocument();
		});
		it("footer가 렌더링 되는지 확인", () => {
			render(
				<Modal isOpen={true} onClose={jest.fn()} footer={"푸터내용"}>
					모달내용
				</Modal>,
			);
			expect(screen.queryByText("푸터내용")).toBeInTheDocument();
		});

		it("hideCloseButton=true일 때 닫기 버튼이 없는지 확인", () => {
			render(
				<Modal isOpen={true} onClose={jest.fn()} hideCloseButton={true}>
					모달내용
				</Modal>,
			);
			expect(screen.queryByRole("button", { name: "모달 닫기" })).not.toBeInTheDocument();
		});

		it("isCenterTitle=true일 때 타이틀이 중앙 정렬 클래스를 가지는지 확인", () => {
			render(
				<Modal isOpen={true} onClose={jest.fn()} title={"타이틀내용"} isCenterTitle={true}>
					모달내용
				</Modal>,
			);
			const titleWrapper = document.querySelector(".justify-center");
			expect(titleWrapper).toBeInTheDocument();
			expect(document.querySelector(".justify-between")).not.toBeInTheDocument();
		});
	});
	describe("onClose 검사", () => {
		const handleClose = jest.fn();

		beforeEach(() => {
			render(
				<Modal isOpen={true} onClose={handleClose} title={"타이틀내용"}>
					모달내용
				</Modal>,
			);
		});

		afterEach(() => {
			handleClose.mockClear();
		});

		it("닫기 버튼 클릭 시 onClose가 호출되는지 확인", async () => {
			const user = userEvent.setup();
			const button = screen.getByRole("button", { name: "모달 닫기" });
			await user.click(button);
			expect(handleClose).toHaveBeenCalledTimes(1);
		});
		it("ESC 키 입력 시 onClose가 호출되는지 확인", async () => {
			const user = userEvent.setup();
			await user.keyboard("{Escape}");
			expect(handleClose).toHaveBeenCalledTimes(1);
		});
		it("모달 바깥 클릭 시 onClose가 호출되는지 확인", async () => {
			const user = userEvent.setup();
			await user.click(document.body);
			expect(handleClose).toHaveBeenCalledTimes(1);
		});
	});
});
