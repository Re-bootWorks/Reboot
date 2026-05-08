import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from ".";

const push = jest.fn();
const logout = jest.fn();
const openLogin = jest.fn();

jest.mock("next/image", () => {
	return function MockImage(props: { alt: string }) {
		return <img alt={props.alt} />;
	};
});

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useRouter: () => ({ push }),
}));

jest.mock("@/hooks/useUser", () => ({
	useUser: jest.fn(),
}));

jest.mock("@/features/header/queries", () => ({
	useGetFavoritesCount: jest.fn(),
}));

jest.mock("@/features/header/components/Notification", () => {
	return function MockNotification() {
		return <button type="button">알림 버튼</button>;
	};
});

jest.mock("@/components/ui/Dropdowns/ActionDropdown", () => {
	return function MockActionDropdown({
		items,
	}: {
		items: { label: string; onClick: () => void; disabled?: boolean }[];
	}) {
		return (
			<div>
				<button type="button">프로필 메뉴 열기</button>
				{items.map((item) => (
					<button key={item.label} type="button" onClick={item.onClick} disabled={item.disabled}>
						{item.label}
					</button>
				))}
			</div>
		);
	};
});

jest.mock("@/store/modal.store", () => ({
	useModalStore: () => ({ openLogin }),
}));

jest.mock("@/features/auth/mutations", () => ({
	useLogout: () => ({ mutate: logout, isPending: false }),
}));

jest.mock("@/features/auth/components/LoginModal", () => ({
	LoginModal: () => null,
}));

jest.mock("@/features/auth/components/SignUpModal", () => ({
	SignUpModal: () => null,
}));

const { usePathname } = jest.requireMock("next/navigation");
const { useUser } = jest.requireMock("@/hooks/useUser");
const { useGetFavoritesCount } = jest.requireMock("@/features/header/queries");

function renderHeader() {
	const user = userEvent.setup();

	render(<Header />);

	return {
		user,
	};
}

describe("Header", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		usePathname.mockReturnValue("/meetup/list");
		useGetFavoritesCount.mockReturnValue({ data: undefined });
	});

	test("로그아웃 상태에서는 로그인 버튼이 보이고 프로필 메뉴와 알림 버튼은 보이지 않는다", async () => {
		useUser.mockReturnValue({ user: null, isLoggedIn: false, isPending: false });

		const { user } = renderHeader();

		const loginButton = screen.getByRole("button", { name: "로그인" });
		const profileMenuButton = screen.queryByRole("button", { name: "프로필 메뉴 열기" });
		const notificationButton = screen.queryByRole("button", { name: "알림 버튼" });

		expect(loginButton).toBeInTheDocument();
		expect(profileMenuButton).not.toBeInTheDocument();
		expect(notificationButton).not.toBeInTheDocument();

		await user.click(loginButton);
		expect(openLogin).toHaveBeenCalledTimes(1);
	});

	test("로그인 상태에서는 알림 버튼, 프로필 메뉴, 찜한 모임 개수가 보인다", async () => {
		useUser.mockReturnValue({
			user: {
				id: 1,
				name: "홍길동",
				email: "test@example.com",
				image: "https://example.com/me.jpg",
			},
			isLoggedIn: true,
			isPending: false,
		});
		useGetFavoritesCount.mockReturnValue({ data: { count: 3 } });

		const { user } = renderHeader();

		const notificationButton = screen.getByRole("button", { name: "알림 버튼" });
		const profileMenuButton = screen.getByRole("button", { name: "프로필 메뉴 열기" });
		const favoritesCount = screen.getByText("3");
		const loginButton = screen.queryByRole("button", { name: "로그인" });

		expect(notificationButton).toBeInTheDocument();
		expect(profileMenuButton).toBeInTheDocument();
		expect(favoritesCount).toBeInTheDocument();
		expect(loginButton).not.toBeInTheDocument();

		const mypageButton = screen.getByRole("button", { name: "마이페이지" });
		await user.click(mypageButton);
		expect(push).toHaveBeenCalledWith("/mypage");

		const logoutButton = screen.getByRole("button", { name: "로그아웃" });
		await user.click(logoutButton);
		expect(logout).toHaveBeenCalledTimes(1);
	});
});
