import userEvent from "@testing-library/user-event";
import NotificationPanel from ".";
import { render, screen } from "@testing-library/react";

const mockCommentItem = {
	id: 1,
	type: "COMMENT",
	message: "새 댓글이 달렸습니다.",
	image: "",
	isRead: false,
	createdAt: "2026-05-01T00:00:00.000Z",
	postId: 10,
};

const mockMeetingItem = {
	id: 2,
	type: "MEETING_CONFIRMED",
	message: "모임이 확정됐습니다.",
	image: "",
	isRead: true,
	createdAt: "2026-05-01T00:00:00.000Z",
	meetingId: 20,
};

const mockFns = {
	push: jest.fn(),
	fetchNextPage: jest.fn(),
	putRead: jest.fn(),
	putReadAll: jest.fn(),
	deleteOne: jest.fn(),
	deleteAll: jest.fn(),
	close: jest.fn(),
};
jest.mock("@/components/ui/Loading", () => {
	return function MockLoading() {
		return <div>로딩 중</div>;
	};
});

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockFns.push }),
}));

jest.mock("@/hooks/useIntersectionObserver", () => ({
	useIntersectionObserver: jest.fn(),
}));

jest.mock("@/features/header/queries", () => ({
	useGetNotifications: jest.fn(),
}));

jest.mock("@/features/header/mutations", () => ({
	usePutNotificationsRead: () => ({ mutate: mockFns.putRead }),
	usePutNotificationsReadAll: () => ({ mutate: mockFns.putReadAll, isPending: false }),
	useDeleteNotifications: () => ({ mutate: mockFns.deleteOne }),
	useDeleteNotificationsAll: () => ({ mutate: mockFns.deleteAll, isPending: false }),
}));

const { useGetNotifications } = jest.requireMock("@/features/header/queries");
const { useIntersectionObserver } = jest.requireMock("@/hooks/useIntersectionObserver");

function mockNotifications(overrides = {}) {
	useGetNotifications.mockReturnValue({
		data: {
			pages: [{ data: [mockCommentItem, mockMeetingItem] }],
		},
		fetchNextPage: mockFns.fetchNextPage,
		hasNextPage: false,
		isFetchingNextPage: false,
		isPending: false,
		...overrides,
	});
}

function renderNotificationPanel(props = {}) {
	const user = userEvent.setup();

	render(<NotificationPanel close={mockFns.close} unreadCount={1} {...props} />);
	return {
		user,
	};
}

describe("상단 알림 패널 컴포넌트", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockNotifications();
	});

	describe("알림 내역을 확인한다", () => {
		test("로딩 중이면 로딩 UI가 보인다", () => {
			mockNotifications({
				isPending: true,
				data: undefined,
			});
			renderNotificationPanel({ unreadCount: 0 });

			const loading = screen.getByText("로딩 중");

			expect(loading).toBeInTheDocument();
		});

		test("알림이 없으면 빈 상태 메시지가 보인다", () => {
			mockNotifications({
				data: { pages: [{ data: [] }] },
			});
			renderNotificationPanel({ unreadCount: 0 });

			const empty = screen.getByText("아직 알림이 없어요");

			expect(empty).toBeInTheDocument();
		});

		test("알림이 있으면 알림 메시지가 렌더링된다", () => {
			renderNotificationPanel();

			const comment = screen.getByText("새 댓글이 달렸습니다.");
			const meeting = screen.getByText("모임이 확정됐습니다.");
			expect(comment).toBeInTheDocument();
			expect(meeting).toBeInTheDocument();
		});
	});

	describe("알림을 읽을 수 있는지 확인한다", () => {
		test("읽지 않은 댓글 알림을 클릭하면 읽음 처리 후 해당 게시글로 이동한다", async () => {
			const { user } = renderNotificationPanel();

			const notifications = screen.getByText("새 댓글이 달렸습니다.");
			await user.click(notifications);

			expect(mockFns.putRead).toHaveBeenCalledWith({ notificationId: 1 });
			expect(mockFns.close).toHaveBeenCalledTimes(1);
			expect(mockFns.push).toHaveBeenCalledWith("/connect/10");
		});

		test("이미 읽은 모임 알림을 클릭하면 읽음 처리는 하지 않고 모임 상세로 이동한다", async () => {
			const { user } = renderNotificationPanel();

			const notifications = screen.getByText("모임이 확정됐습니다.");
			await user.click(notifications);

			expect(mockFns.putRead).not.toHaveBeenCalledWith({ notificationId: 2 });
			expect(mockFns.close).toHaveBeenCalledTimes(1);
			expect(mockFns.push).toHaveBeenCalledWith("/meetup/20");
		});

		test("모두 읽기 버튼을 클릭하면 전체 읽음 액션이 호출된다", async () => {
			const { user } = renderNotificationPanel();

			const readButton = screen.getByRole("button", { name: "모두 읽기" });
			await user.click(readButton);

			expect(mockFns.putReadAll).toHaveBeenCalledTimes(1);
		});

		test("읽지 않은 알림이 없으면 모두 읽기 버튼이 비활성화된다", () => {
			mockNotifications({
				data: {
					pages: [
						{
							data: [
								{ ...mockCommentItem, isRead: true },
								{ ...mockMeetingItem, isRead: true },
							],
						},
					],
				},
			});
			renderNotificationPanel({ unreadCount: 0 });

			const readButton = screen.getByRole("button", { name: "모두 읽기" });

			expect(readButton).toBeDisabled();
		});
	});

	describe("알림을 삭제할 수 있는지 확인한다", () => {
		test("알림 삭제 버튼을 클릭하면 개별 삭제 액션이 호출된다", async () => {
			const { user } = renderNotificationPanel();

			const deleteButtons = screen.getAllByRole("button", { name: "알림 삭제" });
			await user.click(deleteButtons[0]);

			expect(mockFns.deleteOne).toHaveBeenCalledWith({ notificationId: 1 });
		});
		test("알림 전체 삭제 버튼을 클릭하면 전체 삭제 액션이 호출된다", async () => {
			const { user } = renderNotificationPanel();

			const deleteButton = screen.getByRole("button", { name: "알림 전체 삭제" });
			await user.click(deleteButton);

			expect(mockFns.deleteAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("무한스크롤이 올바르게 작동하는지 확인한다", () => {
		test("다음 페이지가 있고 가져오는 중이 아니면 무한 스크롤 감시가 활성화된다", () => {
			mockNotifications({
				hasNextPage: true,
			});

			renderNotificationPanel();

			expect(useIntersectionObserver).toHaveBeenCalledWith(
				expect.objectContaining({
					onIntersect: mockFns.fetchNextPage,
					isEnabled: true,
				}),
			);
		});

		test("다음 페이지가 없으면 무한 스크롤 감시가 비활성화된다", () => {
			mockNotifications({
				hasNextPage: false,
				isFetchingNextPage: false,
			});

			renderNotificationPanel();

			expect(useIntersectionObserver).toHaveBeenCalledWith(
				expect.objectContaining({
					onIntersect: mockFns.fetchNextPage,
					isEnabled: false,
				}),
			);
		});

		test("다음 페이지를 가져오는 중이면 무한 스크롤 감시가 비활성화된다", () => {
			mockNotifications({
				hasNextPage: true,
				isFetchingNextPage: true,
			});

			renderNotificationPanel();

			expect(useIntersectionObserver).toHaveBeenCalledWith(
				expect.objectContaining({
					onIntersect: mockFns.fetchNextPage,
					isEnabled: false,
				}),
			);
		});
	});
});
