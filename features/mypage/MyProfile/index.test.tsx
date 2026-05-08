import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyProfileContainer from ".";
import { mockUserProfile } from "../mockData";

jest.mock("react-loading-skeleton", () => {
	return function MockSkeleton() {
		return <div data-testid="profile-skeleton" />;
	};
});

jest.mock("@/components/ui/Avatar", () => {
	return function MockAvatar({ src }: { src: string | null }) {
		return <img alt="프로필 이미지" src={src ?? ""} />;
	};
});

jest.mock("../components/ProfileModal", () => {
	return function MockProfileModal({ isOpen, user }: { isOpen: boolean; user: { name: string } }) {
		return isOpen ? <div role="dialog">{user.name} 프로필 수정 모달</div> : null;
	};
});

jest.mock("@/hooks/useUser", () => ({
	useUser: jest.fn(),
}));

const { useUser } = jest.requireMock("@/hooks/useUser");

function renderMyProfile() {
	const user = userEvent.setup();
	const view = render(<MyProfileContainer />);

	return {
		user,
		...view,
	};
}

describe("MyProfile", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("유저 정보가 로딩 중이면 프로필 스켈레톤을 렌더링한다", () => {
		useUser.mockReturnValue({ user: null, isPending: true });

		renderMyProfile();

		const skeletons = screen.getAllByTestId("profile-skeleton");
		expect(skeletons).toHaveLength(3);
	});

	test("유저 정보가 있으면 이름과 이메일을 렌더링한다", () => {
		useUser.mockReturnValue({ user: mockUserProfile, isPending: false });

		renderMyProfile();

		const name = screen.getByText("홍길동");
		const email = screen.getByText("test@example.com");

		expect(name).toBeInTheDocument();
		expect(email).toBeInTheDocument();
	});

	test("프로필 수정 버튼을 클릭하면 프로필 모달을 연다", async () => {
		useUser.mockReturnValue({ user: mockUserProfile, isPending: false });

		const { user } = renderMyProfile();

		const editButton = screen.getByRole("button", { name: "프로필 수정" });
		await user.click(editButton);

		const modal = screen.getByRole("dialog");
		expect(modal).toHaveTextContent("홍길동 프로필 수정 모달");
	});

	test("유저 정보가 없으면 아무것도 렌더링하지 않는다", () => {
		useUser.mockReturnValue({ user: null, isPending: false });

		const { container } = renderMyProfile();

		expect(container).toBeEmptyDOMElement();
	});
});
