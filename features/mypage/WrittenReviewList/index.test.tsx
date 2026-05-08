import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WrittenReviewListWrapper from ".";
import { mockUserProfile } from "../mockData";
import { ReviewCardItem } from "../types";

const patchReviews = jest.fn();
const deleteReviews = jest.fn();
const reviewFormValues = { score: 4, comment: "수정한 리뷰입니다" };

const mockReviewItem: ReviewCardItem = {
	id: 123,
	score: 5,
	comment: "함께 공부해서 좋았어요",
	meetingId: 1000,
	meetingType: "자기계발",
	meetingName: "코딩 스터디",
	meetingImage: "https://example.com/image.jpg",
	meetingDateTime: "2026-04-02T16:05:00.000Z",
	createdAt: "2026-04-08T06:22:04.892Z",
};

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

jest.mock("../components/ReviewCard", () => {
	return function MockReviewCard({
		item,
		handleEdit,
		handleDelete,
	}: {
		item: { meetingName: string; comment: string };
		handleEdit: () => void;
		handleDelete: () => void;
	}) {
		return (
			<li>
				<span>{item.meetingName}</span>
				<span>{item.comment}</span>
				<button type="button" onClick={handleEdit}>
					수정하기
				</button>
				<button type="button" onClick={handleDelete}>
					삭제하기
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
		initialValue,
		handleFormSubmit,
	}: {
		isOpen: boolean;
		initialValue?: { score?: number; comment?: string };
		handleFormSubmit: (values: typeof reviewFormValues) => void;
	}) {
		return isOpen ? (
			<div role="dialog">
				<span>초기 리뷰: {initialValue?.comment}</span>
				<button type="button" onClick={() => handleFormSubmit(reviewFormValues)}>
					리뷰 수정 제출
				</button>
			</div>
		) : null;
	},
}));

jest.mock("@/hooks/useUser", () => ({
	useUser: jest.fn(),
}));

jest.mock("../queries", () => ({
	useMyReviewInfinite: jest.fn(),
}));

jest.mock("../mutations", () => ({
	usePatchReviews: () => ({ mutate: patchReviews, isPending: false }),
	useDeleteReviews: () => ({ mutate: deleteReviews, isPending: false }),
}));

const { useUser } = jest.requireMock("@/hooks/useUser");
const { useMyReviewInfinite } = jest.requireMock("../queries");

function setWrittenReviews(data = [mockReviewItem], isFetchingNextPage = false) {
	useMyReviewInfinite.mockReturnValue({
		data: { pages: [{ data }] },
		hasNextPage: false,
		isFetchingNextPage,
	});
}

function renderWrittenReviewList() {
	const user = userEvent.setup();
	const view = render(<WrittenReviewListWrapper />);

	return {
		user,
		...view,
	};
}

describe("WrittenReviewList", () => {
	const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

	beforeEach(() => {
		jest.clearAllMocks();
		useUser.mockReturnValue({ user: mockUserProfile });
		setWrittenReviews();
	});

	afterAll(() => {
		consoleError.mockRestore();
	});

	test("작성한 리뷰를 렌더링한다", () => {
		renderWrittenReviewList();

		const meetingName = screen.getByText("코딩 스터디");
		const comment = screen.getByText("함께 공부해서 좋았어요");

		expect(meetingName).toBeInTheDocument();
		expect(comment).toBeInTheDocument();
	});

	test("유저 정보가 없으면 아무것도 렌더링하지 않는다", () => {
		useUser.mockReturnValue({ user: null });

		const { container } = renderWrittenReviewList();

		expect(container).toBeEmptyDOMElement();
	});

	test("데이터가 없으면 Empty UI를 렌더링한다", () => {
		setWrittenReviews([]);

		renderWrittenReviewList();

		const empty = screen.getByText("아직 작성한 리뷰가 없어요");
		expect(empty).toBeInTheDocument();
	});

	test("다음 페이지를 불러오는 중이면 Loading UI를 렌더링한다", () => {
		setWrittenReviews([mockReviewItem], true);

		renderWrittenReviewList();

		const loading = screen.getByText("목록 로딩 중");
		expect(loading).toBeInTheDocument();
	});

	test("리뷰 수정 모달에서 제출하면 리뷰 수정 mutation을 호출한다", async () => {
		const { user } = renderWrittenReviewList();

		const editButton = screen.getByRole("button", { name: "수정하기" });
		await user.click(editButton);

		const initialReview = screen.getByText("초기 리뷰: 함께 공부해서 좋았어요");
		const submitButton = screen.getByRole("button", { name: "리뷰 수정 제출" });

		expect(initialReview).toBeInTheDocument();

		await user.click(submitButton);

		expect(patchReviews).toHaveBeenCalledWith(
			{ reviewId: 123, reviewFormValues },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	test("리뷰 삭제를 확인하면 리뷰 삭제 mutation을 호출한다", async () => {
		const { user } = renderWrittenReviewList();

		const deleteButton = screen.getByRole("button", { name: "삭제하기" });
		await user.click(deleteButton);

		const alertMessage = screen.getByText("리뷰를 삭제하시겠습니까?");
		const alertConfirmButton = screen.getByRole("button", { name: "확인" });

		expect(alertMessage).toBeInTheDocument();

		await user.click(alertConfirmButton);

		expect(deleteReviews).toHaveBeenCalledWith(
			{ reviewId: 123 },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	test("데이터 조회 중 에러가 발생하면 ErrorBoundary fallback UI를 렌더링한다", () => {
		useMyReviewInfinite.mockImplementation(() => {
			throw new Error("query error");
		});

		renderWrittenReviewList();

		const errorMessage = screen.getByText("작성한 리뷰를 불러오지 못했습니다.");
		expect(errorMessage).toBeInTheDocument();
	});
});
