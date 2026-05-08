import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvailableReviewListWrapper from ".";
import { mockMeMeetingApiRes } from "../mockData";

const handleWishToggle = jest.fn();
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
		item: { id: number; name: string; isFavorited: boolean };
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
	default: () => ({ handleWishToggle }),
}));

jest.mock("../queries", () => ({
	useMyMeetupInfinite: jest.fn(),
}));

jest.mock("../mutations", () => ({
	usePostMeetingsReviews: () => ({ mutate: postMeetingReview, isPending: false }),
}));

const { useMyMeetupInfinite } = jest.requireMock("../queries");

function setAvailableReviews(data = [mockMeMeetingApiRes], isFetchingNextPage = false) {
	useMyMeetupInfinite.mockReturnValue({
		data: { pages: [{ data }] },
		hasNextPage: false,
		isFetchingNextPage,
	});
}

function renderAvailableReviewList() {
	const user = userEvent.setup();

	render(<AvailableReviewListWrapper />);

	return {
		user,
	};
}

describe("AvailableReviewList", () => {
	const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

	beforeEach(() => {
		jest.clearAllMocks();
		setAvailableReviews();
	});

	afterAll(() => {
		consoleError.mockRestore();
	});

	test("작성 가능한 리뷰 모임을 렌더링한다", () => {
		renderAvailableReviewList();

		const name = screen.getByText("코딩 스터디");
		const reviewButton = screen.getByRole("button", { name: "리뷰 작성하기" });

		expect(name).toBeInTheDocument();
		expect(reviewButton).toBeInTheDocument();
	});

	test("데이터가 없으면 Empty UI를 렌더링한다", () => {
		setAvailableReviews([]);

		renderAvailableReviewList();

		const empty = screen.getByText("작성 가능한 리뷰가 없어요");
		expect(empty).toBeInTheDocument();
	});

	test("다음 페이지를 불러오는 중이면 Loading UI를 렌더링한다", () => {
		setAvailableReviews([mockMeMeetingApiRes], true);

		renderAvailableReviewList();

		const loading = screen.getByText("목록 로딩 중");
		expect(loading).toBeInTheDocument();
	});

	test("찜 버튼을 클릭하면 찜 토글 핸들러를 호출한다", async () => {
		setAvailableReviews([{ ...mockMeMeetingApiRes, isFavorited: false }]);

		const { user } = renderAvailableReviewList();
		const wishButton = screen.getByRole("button", { name: "찜 토글" });
		await user.click(wishButton);

		expect(handleWishToggle).toHaveBeenCalledWith(mockMeMeetingApiRes.id, false);
	});

	test("리뷰 작성 모달에서 제출하면 리뷰 작성 mutation을 호출한다", async () => {
		const { user } = renderAvailableReviewList();

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
		useMyMeetupInfinite.mockImplementation(() => {
			throw new Error("query error");
		});

		renderAvailableReviewList();

		const errorMessage = screen.getByText("작성 가능 한 리뷰를 불러오지 못했습니다.");
		const retryButton = screen.getByRole("button", { name: "다시 시도" });

		expect(errorMessage).toBeInTheDocument();
		expect(retryButton).toBeInTheDocument();
	});
});
