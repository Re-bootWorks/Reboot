import { render, screen } from "@testing-library/react";
import Alert from ".";
import userEvent from "@testing-library/user-event";

// HeadlessUI 테스트 경고로 인해 단순 모달 UI로 대체
jest.mock("..", () => ({
	Modal: ({
		isOpen,
		children,
		footer,
	}: {
		isOpen: boolean;
		children: React.ReactNode;
		footer?: React.ReactNode;
	}) =>
		isOpen ? (
			<div role="dialog" aria-modal="true">
				<div>{children}</div>
				{footer && <div>{footer}</div>}
			</div>
		) : null,
}));

describe("AlertModal", () => {
	describe("모달이 열리고 닫히는지 확인한다", () => {
		test("isOpen이 true면 모달이 열리고 메세지가 보인다", () => {
			render(
				<Alert isOpen={true} onClose={() => {}} handleConfirmButton={() => {}}>
					Alert 메세지
				</Alert>,
			);

			expect(screen.getByText("Alert 메세지")).toBeInTheDocument();
		});
		test("isOpen이 false면 메세지가 보이지 않는다.", () => {
			render(
				<Alert isOpen={false} onClose={() => {}} handleConfirmButton={() => {}}>
					Alert 메세지
				</Alert>,
			);

			expect(screen.queryByText("Alert 메세지")).not.toBeInTheDocument();
		});
	});

	describe("취소 버튼으로 모달을 닫을 수 있는지 확인한다", () => {
		test("취소 버튼 클릭 시 onClose가 호출되며 모달이 닫긴다.", async () => {
			const handleClose = jest.fn();

			render(
				<Alert isOpen={true} onClose={handleClose} handleConfirmButton={() => {}}>
					Alert 메세지
				</Alert>,
			);

			const user = userEvent.setup();
			const button = screen.getByRole("button", { name: "취소" });

			await user.click(button);

			expect(handleClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("확인 버튼으로 동작을 실행할 수 있는지 확인한다", () => {
		test("확인 버튼 클릭 시 handleConfirm이 호출되는지 확인", async () => {
			const handleConfirm = jest.fn();
			render(
				<Alert isOpen={true} onClose={() => {}} handleConfirmButton={handleConfirm}>
					Alert 메세지
				</Alert>,
			);
			const user = userEvent.setup();
			const button = screen.getByRole("button", { name: "확인" });

			await user.click(button);

			expect(handleConfirm).toHaveBeenCalledTimes(1);
		});
	});

	describe("버튼 문구가 올바르게 보이는지 확인한다", () => {
		test("confirmLabel='삭제'면 버튼에 삭제가 보이는지 확인", async () => {
			render(
				<Alert isOpen={true} confirmLabel="삭제" onClose={() => {}} handleConfirmButton={() => {}}>
					Alert 메세지
				</Alert>,
			);

			const button = screen.getByRole("button", { name: "삭제" });
			expect(button).toBeInTheDocument();
		});
	});
});
