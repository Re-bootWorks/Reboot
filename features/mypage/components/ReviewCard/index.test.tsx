import userEvent from "@testing-library/user-event";
import ReviewCard from ".";
import { ReviewCardItem } from "../../types";
import { mockUserProfile } from "../../mockData";
import { render, screen } from "@testing-library/react";

jest.mock("next/image", () => {
	return function MockImage(props: { alt: string }) {
		return <img alt={props.alt} />;
	};
});

jest.mock("@smastrom/react-rating", () => ({
	Rating: ({ value }: { value: number }) => <div data-testid="rating-value">{value}</div>,
}));

const mockItem: ReviewCardItem = {
	id: 10,
	score: 5,
	comment: "함께 공부해서 좋았어요",
	meetingId: 1000,
	meetingType: "자기계발",
	meetingName: "코딩 스터디",
	meetingImage: "https://example.com/image.jpg",
	meetingDateTime: "2026-04-02T16:05:00.000Z",
	createdAt: "2026-04-08T06:22:04.892Z",
};

function renderReviewCard(props = {}) {
	const user = userEvent.setup();
	const handleEdit = jest.fn();
	const handleDelete = jest.fn();

	render(
		<ReviewCard
			user={mockUserProfile}
			item={mockItem}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			{...props}
		/>,
	);
	return {
		user,
		handleEdit,
		handleDelete,
	};
}

describe("작성한 리뷰 컴포넌트", () => {
	describe("작성한 리뷰 내용을 확인한다", () => {
		test("별점, 리뷰 내용, 모임명, 카테고리, 작성자 이름이 렌더링 된다", () => {
			renderReviewCard();

			const score = screen.getByTestId("rating-value");
			const review = screen.getByText("함께 공부해서 좋았어요");
			const meetingName = screen.getByText("코딩 스터디");
			const type = screen.getByText("자기계발");
			const userName = screen.getByText("홍길동");

			expect(score).toHaveTextContent("5");
			expect(review).toBeInTheDocument();
			expect(meetingName).toBeInTheDocument();
			expect(type).toBeInTheDocument();
			expect(userName).toBeInTheDocument();
		});

		test("이미지에 상세페이지 링크가 연결된다", () => {
			renderReviewCard();

			const imageLink = screen.getByRole("link", {
				name: "코딩 스터디모임 대표 이미지",
			});

			expect(imageLink).toHaveAttribute("href", "/meetup/1000");
		});
	});
	describe("작성한 리뷰를 변경한다", () => {
		test("수정하기 클릭 시 수정 액션이 실행된다", async () => {
			const { user, handleEdit } = renderReviewCard();

			const dropdown = screen.getByRole("button", { name: "리뷰 옵션 열기" });
			await user.click(dropdown);

			const editButton = await screen.findByRole("menuitem", { name: "수정하기" });
			await user.click(editButton);

			expect(handleEdit).toHaveBeenCalledTimes(1);
		});
		test("삭제하기 클릭 시 삭제 액션이 실행된다", async () => {
			const { user, handleDelete } = renderReviewCard();

			const dropdown = screen.getByRole("button", { name: "리뷰 옵션 열기" });
			await user.click(dropdown);

			const deleteButton = await screen.findByRole("menuitem", { name: "삭제하기" });
			await user.click(deleteButton);

			expect(handleDelete).toHaveBeenCalledTimes(1);
		});
	});
});
