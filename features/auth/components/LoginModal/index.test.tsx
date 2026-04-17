import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginModal } from "@/features/auth/components/LoginModal";
import { useModalStore } from "@/store/modal.store";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
	usePathname: jest.fn().mockReturnValue("/"),
}));

jest.mock("../../../../store/modal.store", () => ({
	useModalStore: jest.fn().mockReturnValue({
		loginOpen: true,
		closeLogin: jest.fn(),
		openSignup: jest.fn(),
	}),
}));

jest.mock("../../mutations", () => ({
	useLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
	useOAuthLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

describe("LoginModal 테스트", () => {
	describe("클릭 검사", () => {
		it("회원가입 버튼 클릭 시 로그인 모달이 닫히고 회원가입 모달로 전환된다", async () => {
			const mockOpenSignup = jest.fn();
			const mockCloseLogin = jest.fn();
			jest.mocked(useModalStore).mockReturnValue({
				loginOpen: true,
				closeLogin: mockCloseLogin,
				openSignup: mockOpenSignup,
			});
			render(<LoginModal />);

			const user = userEvent.setup();
			await user.click(screen.getByRole("button", { name: "회원가입" }));
			expect(mockCloseLogin).toHaveBeenCalled();
			expect(mockOpenSignup).toHaveBeenCalled();
		});
	});
});
