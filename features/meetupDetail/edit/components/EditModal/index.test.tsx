import EditModal from "@/features/meetupDetail/edit/components/EditModal/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";

const mockHandleShowToast = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnClose = jest.fn();

jest.mock("@/providers/toast-provider", () => ({
	useToast: () => ({ handleShowToast: mockHandleShowToast }),
}));

jest.mock("@/features/meetupDetail/edit/components/TabBasicInfo", () => ({
	__esModule: true,
	default: () => <div data-testid="tab-basic-info" />,
}));

jest.mock("@/features/meetupDetail/edit/components/TabSchedule", () => ({
	__esModule: true,
	default: () => <div data-testid="tab-schedule" />,
}));

const defaultProps = {
	isOpen: true,
	onClose: mockOnClose,
	onSubmit: mockOnSubmit,
	isPending: false,
	initialData: {
		...mockEditInitialData,
		dateTime: "2099-04-30T14:00:00.000Z",
		registrationEnd: "2099-04-27T14:00:00.000Z",
	},
	participantCount: 5,
};

// ─────────────────────────────────────────────
// EditModal
// ─────────────────────────────────────────────
describe("모임 수정 모달 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockOnSubmit.mockResolvedValue(undefined);
	});

	describe("렌더링", () => {
		it("isOpen이 false일 때, 모달이 렌더링되지 않는다.", () => {
			render(<EditModal {...defaultProps} isOpen={false} />);
			expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
		});

		it("'일정 및 인원' 탭 클릭 시, TabSchedule이 렌더링된다.", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} />);
			await user.click(screen.getByRole("tab", { name: "일정 및 인원" }));
			expect(screen.getByTestId("tab-schedule")).toBeInTheDocument();
		});
	});

	describe("유효성 검사", () => {
		it("필수 필드가 비어있으면 에러 토스트가 호출되고, onSubmit은 호출되지 않는다.", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} initialData={{ ...mockEditInitialData, name: "" }} />);
			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(mockHandleShowToast).toHaveBeenCalledWith(
				expect.objectContaining({ status: "error" }),
			);
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it("정원이 참가자 수보다 적으면 에러 토스트가 호출된다", async () => {
			const user = userEvent.setup();
			render(
				<EditModal
					{...defaultProps}
					initialData={{ ...mockEditInitialData, capacity: 2 }}
					participantCount={5}
				/>,
			);
			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(mockHandleShowToast).toHaveBeenCalledWith({
				message: "최대 인원은 3이상이어야 합니다.",
				status: "error",
			});
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it("유효성 검사 실패 시 해당 탭으로 이동한다", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} initialData={{ ...mockEditInitialData, name: "" }} />);
			await user.click(screen.getByRole("tab", { name: "일정 및 인원" }));
			expect(screen.getByTestId("tab-schedule")).toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(screen.getByTestId("tab-basic-info")).toBeInTheDocument();
		});
	});

	describe("수정하기 제출", () => {
		it("유효성 검사 통과 시 onSubmit이 호출된다", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(mockOnSubmit).toHaveBeenCalledWith(defaultProps.initialData);
		});

		it("onSubmit 성공 시 성공 토스트가 호출되고, onClose가 호출된다.", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(mockHandleShowToast).toHaveBeenCalledWith({
				message: "모임이 수정되었습니다.",
				status: "success",
			});
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it("onSubmit 실패 시 에러 토스트가 호출되고, onClose는 호출되지 않는다.", async () => {
			mockOnSubmit.mockRejectedValue(new Error("서버 오류"));
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "수정하기" }));
			expect(mockHandleShowToast).toHaveBeenCalledWith({
				message: "서버 오류",
				status: "error",
			});
			expect(mockOnClose).not.toHaveBeenCalled();
		});
	});

	describe("취소 버튼", () => {
		it("취소 버튼 클릭 시 onClose가 호출된다", async () => {
			const user = userEvent.setup();
			render(<EditModal {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "취소" }));
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});
});
