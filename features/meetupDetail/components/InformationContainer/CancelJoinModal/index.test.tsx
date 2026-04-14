import { render, screen } from "@testing-library/react";
import CancelJoinModal from "@/features/meetupDetail/components/InformationContainer/CancelJoinModal/index";
import userEvent from "@testing-library/user-event";

const defaultProps = {
	isOpen: true,
	isPending: false,
	onClose: jest.fn(),
	onConfirm: jest.fn(),
};

// ─────────────────────────────────────────────
// CancelJoinModal
// ─────────────────────────────────────────────
describe("모임 참여 취소 확인 모달", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("isOpen=false일 때 모달이 렌더링되지 않는다.", () => {
		render(<CancelJoinModal {...defaultProps} isOpen={false} />);
		expect(screen.queryByText("모임 참여를 취소하시겠어요?")).not.toBeInTheDocument();
	});

	describe("버튼 인터랙션", () => {
		it("취소 버튼 클릭 시 onClose가 호출된다.", async () => {
			const onClose = jest.fn();
			const user = userEvent.setup();
			render(<CancelJoinModal {...defaultProps} onClose={onClose} />);
			await user.click(screen.getByRole("button", { name: "취소" }));
			expect(onClose).toHaveBeenCalledTimes(1);
		});
		it("참여 취소하기 버튼 클릭 시, onConfirm이 호출된다.", async () => {
			const onConfirm = jest.fn();
			const user = userEvent.setup();
			render(<CancelJoinModal {...defaultProps} onConfirm={onConfirm} />);
			await user.click(screen.getByRole("button", { name: "참여 취소하기" }));
			expect(onConfirm).toHaveBeenCalledTimes(1);
		});
	});

	describe("isPending 상태", () => {
		it("isPending이 true일 때, 참여 취소하기 버튼이 비활성화된다.", () => {
			render(<CancelJoinModal {...defaultProps} isPending={true} />);
			const button = screen.getByRole("button", { name: "요청 처리 중" });
			expect(button).toBeDisabled();
		});
	});

	describe("모달 닫기", () => {
		it("ESC 키 입력 시, onClose가 호출된다.", async () => {
			const onClose = jest.fn();
			const user = userEvent.setup();
			render(<CancelJoinModal {...defaultProps} onClose={onClose} />);
			await user.keyboard("{Escape}");
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it("모달 바깥 클릭 시 onClose가 호출된다.", async () => {
			const onClose = jest.fn();
			const user = userEvent.setup();
			render(<CancelJoinModal {...defaultProps} onClose={onClose} />);
			await user.click(document.body);
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});
});
