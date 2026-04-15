import CompactCards from "@/features/meetupDetail/components/CompactCards/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUser } from "@/features/meetupDetail/testUtils";
import { useModalStore } from "@/store/modal.store";

const mockPush = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/utils/date", () => ({
	...jest.requireActual("@/utils/date"),
	isDeadlinePassed: jest.fn(),
	uiFormatDate: () => "5월1일",
	uiFormatTime: () => "14:00",
	uiFormatDeadline: () => "3일 후 마감",
}));

jest.mock("@/hooks/useUser", () => ({
	useUser: jest.fn(),
}));

jest.mock("@/features/meetupDetail/mutations", () => ({
	useFavoriteMutation: () => ({
		mutate: mockToggleFavorite,
		isPending: false,
	}),
}));

const { isDeadlinePassed } = jest.requireMock("@/utils/date");

const defaultProps = {
	id: 1,
	isFavorited: false,
	registrationEnd: "2026-05-01T00:00:00.000Z",
	dateTime: "2026-05-10T14:00:00.000Z",
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	image: "/img.png",
};

// ─────────────────────────────────────────────
// CompactCards
// ─────────────────────────────────────────────
describe("관련 모임 카드 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		isDeadlinePassed.mockReturnValue(false);
		mockUser(1);
		useModalStore.setState({ loginOpen: false });
	});

	describe("마감 태그", () => {
		it("마감되지 않은 경우, 마감 태그가 렌더링된다.", () => {
			isDeadlinePassed.mockReturnValue(false);
			render(<CompactCards {...defaultProps} />);
			expect(screen.getByText("3일 후 마감")).toBeInTheDocument();
		});

		it("마감된 경우, 마감 태그가 렌더링되지 않는다.", () => {
			isDeadlinePassed.mockReturnValue(true);
			render(<CompactCards {...defaultProps} />);
			expect(screen.queryByText("3일 후 마감")).not.toBeInTheDocument();
		});
	});

	describe("카드 클릭 후, 경로 이동", () => {
		it("카드 클릭 시, 해당 모임 상세 페이지로 이동한다.", async () => {
			const user = userEvent.setup();
			render(<CompactCards {...defaultProps} id={1} />);
			await user.click(screen.getByText("달램핏 모임"));
			expect(mockPush).toHaveBeenCalledWith("/meetup/1");
		});
	});

	describe("찜 버튼", () => {
		it("로그인 상태에서 찜 버튼 클릭 시, toggleFavorite이 호출된다.", async () => {
			mockUser(1);
			const user = userEvent.setup();
			render(<CompactCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "찜 하기" }));
			expect(mockToggleFavorite).toHaveBeenCalledWith({ currentState: false });
		});

		it("비로그인 상태에서 찜 버튼 클릭 시, 로그인 모달이 열린다.", async () => {
			mockUser(null);
			const user = userEvent.setup();
			render(<CompactCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "찜 하기" }));
			expect(useModalStore.getState().loginOpen).toBe(true);
			expect(mockToggleFavorite).not.toHaveBeenCalled();
		});

		it("isPending 상태에서 찜 버튼 클릭 시, toggleFavorite이 호출되지 않는다.", async () => {
			mockUser(1, true);
			const user = userEvent.setup();
			render(<CompactCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "찜 하기" }));
			expect(mockToggleFavorite).not.toHaveBeenCalled();
		});

		it("찜 버튼 클릭 시, 카드 클릭 이벤트가 전파되지 않는다.", async () => {
			const user = userEvent.setup();
			render(<CompactCards {...defaultProps} />);
			await user.click(screen.getByRole("button", { name: "찜 하기" }));
			expect(mockPush).not.toHaveBeenCalled();
		});
	});
});
