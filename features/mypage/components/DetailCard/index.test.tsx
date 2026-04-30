import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailCard from ".";
import { mockMeMeetingApiRes } from "../../mockData";

jest.mock("next/image", () => {
	return function MockImage(props: { alt: string }) {
		return <img alt={props.alt} />;
	};
});

function renderDetailCard(props = {}) {
	const user = userEvent.setup();

	render(<DetailCard item={mockMeMeetingApiRes} {...props} />);
	return {
		user,
	};
}

describe("모임 카드 컴포넌트", () => {
	describe("모임 정보를 확인한다", () => {
		test("모임명, 참여 인원, 위치, 날짜, 시간이 렌더링 된다", () => {
			renderDetailCard();

			const name = screen.getByText("코딩 스터디");
			const participantCount = screen.getByText("2/2");
			const region = screen.getByText("경기 수원시 영통구");
			const date = screen.getByText("4월 6일");
			const time = screen.getByText("01:05");

			expect(name).toBeInTheDocument();
			expect(participantCount).toBeInTheDocument();
			expect(region).toBeInTheDocument();
			expect(date).toBeInTheDocument();
			expect(time).toBeInTheDocument();
		});

		test("모임명과 이미지에 상세페이지 링크가 연결된다", () => {
			renderDetailCard();

			const titleLink = screen.getByRole("link", { name: "코딩 스터디" });
			const imageLink = screen.getByRole("link", {
				name: "코딩 스터디모임 대표 이미지",
			});

			expect(titleLink).toHaveAttribute("href", "/meetup/1000");
			expect(imageLink).toHaveAttribute("href", "/meetup/1000");
		});

		test("badge가 있으면 렌더링 된다", () => {
			renderDetailCard({
				badges: [
					{
						label: "개설확정",
						variant: "completed",
					},
				],
			});

			const badge = screen.getByText("개설확정");
			expect(badge).toBeInTheDocument();
		});
	});
	describe("모임 액션 버튼을 클릭한다", () => {
		test("액션 버튼을 클릭하면 액션 핸들러가 실행된다", async () => {
			const handleClick = jest.fn();
			const { user } = renderDetailCard({
				actions: [
					{
						label: "리뷰 작성하기",
						variant: "primary",
						handleCardButtonClick: handleClick,
					},
				],
			});

			const reviewCreateButton = screen.getByRole("button", { name: "리뷰 작성하기" });
			await user.click(reviewCreateButton);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		test("찜 버튼을 클릭하면 찜하기가 된다", async () => {
			const handleWishClick = jest.fn();

			const { user } = renderDetailCard({
				wishAction: {
					isWished: false,
					isPending: false,
					handleWishClick,
				},
			});

			const wishButton = screen.getByRole("button", { name: "찜 하기" });
			await user.click(wishButton);

			expect(handleWishClick).toHaveBeenCalledTimes(1);
		});
	});
});
