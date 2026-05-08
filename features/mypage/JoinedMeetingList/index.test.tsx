import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinedMeetingListWrapper from ".";
import { mockMeMeetingApiRes } from "../mockData";

const handleWishToggle = jest.fn();
const deleteMeetingsJoin = jest.fn();

jest.mock("@/components/ui/Empty", () => {
	return function MockEmpty({ children }: { children: React.ReactNode }) {
		return <div>{children}</div>;
	};
});

jest.mock("@/components/ui/Loading", () => {
	return function MockLoading() {
		return <div>목록 로딩 중</div>;
	};
});

jest.mock("../components/DetailCard", () => {
	return function MockDetailCard({
		item,
		actions = [],
		wishAction,
	}: {
		item: { name: string };
		actions?: { label: string; handleCardButtonClick: () => void }[];
		wishAction?: { handleWishClick: () => void };
	}) {
		return (
			<li>
				<span>{item.name}</span>
				{actions.map((action) => (
					<button key={action.label} type="button" onClick={action.handleCardButtonClick}>
						{action.label}
					</button>
				))}
				<button type="button" onClick={wishAction?.handleWishClick}>
					찜 토글
				</button>
			</li>
		);
	};
});

jest.mock("@/components/ui/Modals/AlertModal", () => {
	return function MockAlert({
		isOpen,
		children,
		handleConfirmButton,
	}: {
		isOpen: boolean;
		children: React.ReactNode;
		handleConfirmButton: () => void;
	}) {
		return isOpen ? (
			<div role="alertdialog">
				{children}
				<button type="button" onClick={handleConfirmButton}>
					확인
				</button>
			</div>
		) : null;
	};
});

jest.mock("@/features/shared/components/ReviewModal", () => ({
	__esModule: true,
	default: function MockReviewModal({ isOpen }: { isOpen: boolean }) {
		return isOpen ? <div role="dialog">리뷰 모달</div> : null;
	},
}));

jest.mock("@/hooks/useMeetingFavorite", () => ({
	__esModule: true,
	default: () => ({ handleWishToggle }),
}));

jest.mock("../queries", () => ({
	useMyJoinedInfinite: jest.fn(),
}));

jest.mock("../mutations", () => ({
	usePatchMeetingsStatus: () => ({ mutate: jest.fn(), isPending: false }),
	useDeleteMeetings: () => ({ mutate: jest.fn(), isPending: false }),
	useDeleteMeetingsJoin: () => ({ mutate: deleteMeetingsJoin, isPending: false }),
	usePostMeetingsReviews: () => ({ mutate: jest.fn(), isPending: false }),
}));

const { useMyJoinedInfinite } = jest.requireMock("../queries");

function setJoinedMeetings(data = [mockMeMeetingApiRes], isFetchingNextPage = false) {
	useMyJoinedInfinite.mockReturnValue({
		data: { pages: [{ data }] },
		hasNextPage: false,
		isFetchingNextPage,
	});
}

function renderJoinedMeetingList() {
	const user = userEvent.setup();

	render(<JoinedMeetingListWrapper />);

	return {
		user,
	};
}

describe("JoinedMeetingList", () => {
	const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

	beforeEach(() => {
		jest.clearAllMocks();
		setJoinedMeetings([{ ...mockMeMeetingApiRes, role: "participant", isCompleted: false }]);
	});

	afterAll(() => {
		consoleError.mockRestore();
	});

	test("내가 참여한 모임을 렌더링한다", () => {
		renderJoinedMeetingList();

		const name = screen.getByText("코딩 스터디");
		const cancelButton = screen.getByRole("button", { name: "참여 취소하기" });

		expect(name).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
	});

	test("데이터가 없으면 Empty UI를 렌더링한다", () => {
		setJoinedMeetings([]);

		renderJoinedMeetingList();

		const empty = screen.getByText("아직 참여한 모임이 없어요");
		expect(empty).toBeInTheDocument();
	});

	test("다음 페이지를 불러오는 중이면 Loading UI를 렌더링한다", () => {
		setJoinedMeetings([{ ...mockMeMeetingApiRes, role: "participant", isCompleted: false }], true);

		renderJoinedMeetingList();

		const loading = screen.getByText("목록 로딩 중");
		expect(loading).toBeInTheDocument();
	});

	test("참여 취소를 확인하면 참여 취소 mutation을 호출한다", async () => {
		const { user } = renderJoinedMeetingList();

		const cancelButton = screen.getByRole("button", { name: "참여 취소하기" });
		await user.click(cancelButton);

		const alertMessage = screen.getByText("모임 예약을 취소하시겠습니까?");
		const alertConfirmButton = screen.getByRole("button", { name: "확인" });

		expect(alertMessage).toBeInTheDocument();

		await user.click(alertConfirmButton);

		expect(deleteMeetingsJoin).toHaveBeenCalledWith(
			{ meetingId: 1000 },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	test("찜 버튼을 클릭하면 찜 토글 핸들러를 호출한다", async () => {
		const { user } = renderJoinedMeetingList();

		const wishButton = screen.getByRole("button", { name: "찜 토글" });
		await user.click(wishButton);

		expect(handleWishToggle).toHaveBeenCalledWith(1000, false);
	});

	test("데이터 조회 중 에러가 발생하면 ErrorBoundary fallback UI를 렌더링한다", () => {
		useMyJoinedInfinite.mockImplementation(() => {
			throw new Error("query error");
		});

		renderJoinedMeetingList();

		const errorMessage = screen.getByText("나의 모임을 불러오지 못했습니다.");
		expect(errorMessage).toBeInTheDocument();
	});
});
