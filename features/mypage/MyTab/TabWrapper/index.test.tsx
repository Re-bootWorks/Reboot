import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabWrapper from ".";

const querySet = jest.fn();
let tabQuery: string | null = null;

jest.mock("@/hooks/useQueryParams", () => ({
	useQueryParams: () => ({
		get: () => tabQuery,
		set: querySet,
	}),
}));

jest.mock("../../JoinedMeetingList", () => {
	return function MockJoinedMeetingList() {
		return <div>참여 모임 콘텐츠</div>;
	};
});

jest.mock("../../CreatedMeetingList", () => {
	return function MockCreatedMeetingList() {
		return <div>개설 모임 콘텐츠</div>;
	};
});

jest.mock("../../AvailableReviewList", () => {
	return function MockAvailableReviewList() {
		return <div>리뷰 작성 콘텐츠</div>;
	};
});

jest.mock("../../WrittenReviewList", () => {
	return function MockWrittenReviewList() {
		return <div>리뷰 목록 콘텐츠</div>;
	};
});

function renderTabWrapper() {
	const user = userEvent.setup();

	render(<TabWrapper />);

	return {
		user,
	};
}

describe("MyTab", () => {
	beforeEach(() => {
		tabQuery = null;
		querySet.mockReset();
		querySet.mockImplementation(({ tab }: { tab: string | null }) => {
			tabQuery = tab;
		});
	});

	test("기본 탭으로 참여 모임 콘텐츠를 렌더링한다", () => {
		renderTabWrapper();

		const joinedTab = screen.getByRole("tab", { name: "참여 모임" });
		const joinedContent = screen.getByText("참여 모임 콘텐츠");

		expect(joinedTab).toBeInTheDocument();
		expect(joinedContent).toBeInTheDocument();
	});

	test("탭을 클릭하면 선택한 콘텐츠로 변경하고 query 값을 갱신한다", async () => {
		const { user } = renderTabWrapper();

		const createdTab = screen.getByRole("tab", { name: "개설 모임" });
		await user.click(createdTab);

		await waitFor(() => {
			const createdContent = screen.getByText("개설 모임 콘텐츠");
			expect(createdContent).toBeInTheDocument();
		});
		expect(querySet).toHaveBeenCalledWith({ tab: "CreatedMeetingList" });
	});

	test("URL query의 tab 값이 있으면 해당 탭 콘텐츠를 기본으로 렌더링한다", () => {
		tabQuery = "WrittenReviewList";

		renderTabWrapper();

		const writtenReviewContent = screen.getByText("리뷰 목록 콘텐츠");
		expect(writtenReviewContent).toBeInTheDocument();
	});

	test("잘못된 tab query 값은 제거한다", async () => {
		tabQuery = "UnknownTab";

		renderTabWrapper();

		await waitFor(() => {
			expect(querySet).toHaveBeenCalledWith({ tab: null });
		});
	});
});
