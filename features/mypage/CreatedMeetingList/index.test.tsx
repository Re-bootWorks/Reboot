import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreatedMeetingListWrapper from ".";
import { mockMeMeetingApiRes } from "../mockData";

const patchMeetingsStatus = jest.fn();
const postMeetingReview = jest.fn();
const reviewFormValues = { score: 5, comment: "좋은 모임이었어요" };

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
	default: function MockReviewModal({
		isOpen,
		handleFormSubmit,
	}: {
		isOpen: boolean;
		handleFormSubmit: (values: typeof reviewFormValues) => void;
	}) {
		return isOpen ? (
			<div role="dialog">
				<button type="button" onClick={() => handleFormSubmit(reviewFormValues)}>
					리뷰 제출
				</button>
			</div>
		) : null;
	},
}));

jest.mock("@/hooks/useMeetingFavorite", () => ({
	__esModule: true,
	default: () => ({ handleWishToggle: jest.fn() }),
}));

jest.mock("../queries", () => ({
	useMyCreatedInfinite: jest.fn(),
}));

jest.mock("../mutations", () => ({
	usePatchMeetingsStatus: () => ({ mutate: patchMeetingsStatus, isPending: false }),
	useDeleteMeetings: () => ({ mutate: jest.fn(), isPending: false }),
	usePostMeetingsReviews: () => ({ mutate: postMeetingReview, isPending: false }),
}));

const { useMyCreatedInfinite } = jest.requireMock("../queries");

function setCreatedMeetings(data = [mockMeMeetingApiRes], isFetchingNextPage = false) {
	useMyCreatedInfinite.mockReturnValue({
		data: { pages: [{ data }] },
		hasNextPage: false,
		isFetchingNextPage,
	});
}

function renderCreatedMeetingList() {
	const user = userEvent.setup();

	render(<CreatedMeetingListWrapper />);

	return {
		user,
	};
}

describe("CreatedMeetingList", () => {
	const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

	beforeEach(() => {
		jest.clearAllMocks();
		setCreatedMeetings([{ ...mockMeMeetingApiRes, isCompleted: false, isReviewed: false }]);
	});

	afterAll(() => {
		consoleError.mockRestore();
	});

	test("내가 만든 모임을 렌더링한다", () => {
		renderCreatedMeetingList();

		const name = screen.getByText("코딩 스터디");
		const confirmButton = screen.getByRole("button", { name: "모임 확정하기" });

		expect(name).toBeInTheDocument();
		expect(confirmButton).toBeInTheDocument();
	});

	test("데이터가 없으면 Empty UI를 렌더링한다", () => {
		setCreatedMeetings([]);

		renderCreatedMeetingList();

		const empty = screen.getByText("아직 내가 만든 모임이 없어요");
		expect(empty).toBeInTheDocument();
	});

	test("다음 페이지를 불러오는 중이면 Loading UI를 렌더링한다", () => {
		setCreatedMeetings([{ ...mockMeMeetingApiRes, isCompleted: false, isReviewed: false }], true);

		renderCreatedMeetingList();

		const loading = screen.getByText("목록 로딩 중");
		expect(loading).toBeInTheDocument();
	});

	test("모임 확정을 확인하면 상태 변경 mutation을 호출한다", async () => {
		const { user } = renderCreatedMeetingList();

		const confirmButton = screen.getByRole("button", { name: "모임 확정하기" });
		await user.click(confirmButton);

		const alertMessage = screen.getByText("모임을 확정하시겠습니까?");
		const alertConfirmButton = screen.getByRole("button", { name: "확인" });

		expect(alertMessage).toBeInTheDocument();

		await user.click(alertConfirmButton);

		expect(patchMeetingsStatus).toHaveBeenCalledWith(
			{ meetingId: 1000, status: "CONFIRMED" },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	test("완료된 미작성 모임에서 리뷰를 제출하면 리뷰 작성 mutation을 호출한다", async () => {
		setCreatedMeetings([{ ...mockMeMeetingApiRes, isCompleted: true, isReviewed: false }]);

		const { user } = renderCreatedMeetingList();

		const reviewButton = screen.getByRole("button", { name: "리뷰 작성하기" });
		await user.click(reviewButton);

		const submitButton = screen.getByRole("button", { name: "리뷰 제출" });
		await user.click(submitButton);

		expect(postMeetingReview).toHaveBeenCalledWith(
			{ meetingId: 1000, reviewFormValues },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	test("데이터 조회 중 에러가 발생하면 ErrorBoundary fallback UI를 렌더링한다", () => {
		useMyCreatedInfinite.mockImplementation(() => {
			throw new Error("query error");
		});

		renderCreatedMeetingList();

		const errorMessage = screen.getByText("내가 만든 모임을 불러오지 못했습니다.");
		expect(errorMessage).toBeInTheDocument();
	});
});
