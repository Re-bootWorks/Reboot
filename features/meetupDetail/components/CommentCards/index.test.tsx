import CommentCards, { CommentProps } from "@/features/meetupDetail/components/CommentCards/index";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUser } from "@/features/meetupDetail/testUtils";

const mockEditReview = jest.fn();
const mockDeleteReview = jest.fn();
const mockOnPageChange = jest.fn();

jest.mock("@smastrom/react-rating", () => ({
	Rating: () => <div data-testid="rating" />,
	Heart: {},
}));

jest.mock("@/hooks/useUser", () => ({
	useUser: jest.fn(),
}));

jest.mock("@/features/meetupDetail/mutations", () => ({
	useEditReviewMutation: () => ({ mutate: mockEditReview }),
	useDeleteReviewMutation: () => ({ mutate: mockDeleteReview }),
}));

jest.mock("@/features/shared/components/ReviewModal", () => ({
	__esModule: true,
	default: ({ isOpen }: { isOpen: boolean }) =>
		isOpen ? <div data-testid="review-modal" /> : null,
}));

jest.mock("@/components/ui/Modals/AlertModal", () => ({
	__esModule: true,
	default: ({
		isOpen,
		onClose,
		handleConfirmButton,
		children,
	}: {
		isOpen: boolean;
		onClose: () => void;
		handleConfirmButton: () => void;
		children: React.ReactNode;
	}) =>
		isOpen ? (
			<div data-testid="delete-modal">
				{children}
				<button onClick={onClose}>취소</button>
				<button onClick={handleConfirmButton}>삭제하기</button>
			</div>
		) : null,
}));

const makeComment = (override: Partial<CommentProps> = {}): CommentProps => ({
	id: 1,
	score: 5,
	comment: "좋은 모임",
	createdAt: "2026-04-01T00:00:00.000Z",
	user: { id: 1, name: "홍길동", image: "/profile.svg" },
	...override,
});

const defaultProps = {
	meetingId: 1,
	comments: [makeComment()],
	currentPage: 1,
	hasMore: false,
	onPageChange: mockOnPageChange,
};

// ─────────────────────────────────────────────
// CommentCards
// ─────────────────────────────────────────────
describe("CommentCards - 리뷰 목록 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUser(99);
	});

	describe("리뷰가 없을 시, 빈 상태 메시지가 렌더링된다.", () => {
		render(<CommentCards {...defaultProps} comments={[]} />);
		expect(screen.getByText("아직 작성된 리뷰가 없어요.")).toBeInTheDocument();
	});

	describe("내 리뷰 액션 드롭다운", () => {
		it("내 리뷰인 경우 액션 드롭다운이 렌더링된다.", () => {
			mockUser(1);
			render(<CommentCards {...defaultProps} />);
			expect(screen.getByRole("button", { name: "액션 메뉴 열기" })).toBeInTheDocument();
		});

		it("내 리뷰가 아닌 경우, 액션 드롭다운이 렌더링되지 않는다.", () => {
			mockUser(99);
			render(<CommentCards {...defaultProps} />);
			expect(screen.queryByRole("button", { name: "액션 메뉴 열기" })).not.toBeInTheDocument();
		});

		it("isPending 상태에서는 액션 드롭다운이 렌더링되지 않는다.", () => {
			mockUser(1, true);
			render(<CommentCards {...defaultProps} />);
			expect(screen.queryByRole("button", { name: "액션 메뉴 열기" })).not.toBeInTheDocument();
		});
	});

	describe("삭제 모달", () => {
		it("삭제하기 클릭 시, 삭제 확인 모달이 열린다.", async () => {
			mockUser(1);
			const user = userEvent.setup();
			render(<CommentCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "액션 메뉴 열기" }));
			await user.click(screen.getByRole("menuitem", { name: "삭제하기" }));
			expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
		});

		it("삭제 모달에서 삭제하기 확인 시, deleteReview가 호출된다.", async () => {
			mockUser(1);
			const user = userEvent.setup();
			render(<CommentCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "액션 메뉴 열기" }));
			await user.click(screen.getByRole("menuitem", { name: "삭제하기" }));
			await user.click(
				within(screen.getByTestId("delete-modal")).getByRole("button", { name: "삭제하기" }),
			);
			expect(mockDeleteReview).toHaveBeenCalledWith(
				1,
				expect.objectContaining({ onSuccess: expect.any(Function) }),
			);
		});
	});

	describe("수정 모달", () => {
		it("수정하기 클릭 시, 수정 모달이 열린다.", async () => {
			mockUser(1);
			const user = userEvent.setup();
			render(<CommentCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "액션 메뉴 열기" }));
			await user.click(screen.getByRole("menuitem", { name: "수정하기" }));
			expect(screen.getByTestId("review-modal")).toBeInTheDocument();
		});
	});

	describe("페이지네이션", () => {
		it("hasMore이 true라면 다음 페이지 버튼이 렌더링된다.", () => {
			render(<CommentCards {...defaultProps} hasMore={true} />);
			expect(screen.getByRole("button", { name: "다음 페이지" })).toBeInTheDocument();
		});

		it("currentPage가 1보다 클 시, 이전 페이지 버튼이 렌더링된다.", () => {
			render(<CommentCards {...defaultProps} hasMore={false} currentPage={2} />);
			expect(screen.getByRole("button", { name: "이전 페이지" })).toBeInTheDocument();
		});
	});
});
