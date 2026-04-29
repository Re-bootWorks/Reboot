import { render, screen } from "@testing-library/react";
import NotificationCard from ".";
import userEvent from "@testing-library/user-event";

const mockItem = {
	id: 1,
	type: "COMMENT",
	message: "새 댓글이 달렸습니다",
	image: "",
	isRead: false,
	createdAt: "2026-05-01T00:00:00.000Z",
	postId: 10,
};

jest.mock("@/components/ui/Thumbnail", () => {
	return function MockThumbnail() {
		return <div data-testid="thumbnail" />;
	};
});

jest.mock("@/components/ui/RelativeTime", () => {
	return function MockRelativeTime({ date }: { date: string }) {
		return <span>{date}</span>;
	};
});

function renderNotificationCard(props = {}) {
	const handleDeleteAction = jest.fn();
	const handleReadAction = jest.fn();
	const user = userEvent.setup();

	render(
		<NotificationCard
			item={mockItem}
			handleDeleteAction={handleDeleteAction}
			handleReadAction={handleReadAction}
			{...props}
		/>,
	);
	return {
		user,
		handleDeleteAction,
		handleReadAction,
	};
}

describe("상단 알림 카드 컴포넌트", () => {
	describe("알림 내용을 확인한다", () => {
		test("알림 타입과 메세지가 렌더링된다", () => {
			renderNotificationCard();

			const notificationType = screen.getByText("새로운 댓글");
			const comment = screen.getByText("새 댓글이 달렸습니다");

			expect(notificationType).toBeInTheDocument();
			expect(comment).toBeInTheDocument();
		});

		test("읽은 알림이면 읽지 않음 표시가 렌더링되지 않는다", () => {
			renderNotificationCard({
				item: {
					...mockItem,
					isRead: true,
				},
			});

			const card = screen.queryByTestId("unread-indicator");
			expect(card).not.toBeInTheDocument();
		});
	});

	describe("알림을 읽고 삭제 할 수 있는지 확인한다", () => {
		test("카드를 클릭하면 읽음 액션이 호출된다", async () => {
			const { handleReadAction, user } = renderNotificationCard();

			const card = screen.getByRole("button", { name: "읽지 않은 알림" });
			await user.click(card);

			expect(handleReadAction).toHaveBeenCalledTimes(1);
		});

		test("삭제 버튼을 클릭하면 삭제 액션이 호출된다", async () => {
			const { handleDeleteAction, user } = renderNotificationCard();

			const deleteButton = screen.getByRole("button", { name: "알림 삭제" });
			await user.click(deleteButton);

			expect(handleDeleteAction).toHaveBeenCalledTimes(1);
		});
	});
});
