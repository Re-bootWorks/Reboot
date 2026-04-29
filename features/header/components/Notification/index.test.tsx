import { render, screen } from "@testing-library/react";

import Notification from ".";

jest.mock("@/components/ui/icons", () => ({
	IcBellOutline: () => <span>읽은 알림 아이콘</span>,
	IcBellUnreadOutline: () => <span>읽지 않은 알림 아이콘</span>,
}));

jest.mock("@/features/header/queries", () => ({
	useGetNotificationsCount: jest.fn(),
}));

jest.mock("@/features/header/components/NotificationPanel", () => {
	return function MockNotificationPanel() {
		return <div>알림 패널</div>;
	};
});

const { useGetNotificationsCount } = jest.requireMock("@/features/header/queries");

describe("상단 알림 아이콘 컴포넌트 ", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("알림 상태를 확인한다", () => {
		test("읽지 않은 알림이 없으면 기본 알림 아이콘이 보인다", () => {
			useGetNotificationsCount.mockReturnValue({
				data: { count: 0 },
			});
			render(<Notification />);

			const icon = screen.getByText("읽은 알림 아이콘");
			expect(icon).toBeInTheDocument();
		});

		test("읽지 않은 알림이 있으면 읽지 않은 알림 아이콘이 보인다", () => {
			useGetNotificationsCount.mockReturnValue({
				data: { count: 3 },
			});
			render(<Notification />);

			const icon = screen.getByText("읽지 않은 알림 아이콘");
			expect(icon).toBeInTheDocument();
		});
	});
});
