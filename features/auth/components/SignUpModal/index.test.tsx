import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpModal } from ".";
import { useModalStore } from "../../../../store/modal.store";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
	usePathname: jest.fn().mockReturnValue("/"),
}));

jest.mock("../../../../store/modal.store", () => ({
	useModalStore: jest.fn().mockReturnValue({
		signupOpen: true,
		closeSignup: jest.fn(),
		openLogin: jest.fn(),
	}),
}));

jest.mock("../../mutations", () => ({
	useSignUp: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
	useOAuthLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

describe("SignUpModal 테스트", () => {
	describe("클릭 검사", () => {
		it("로그인 버튼 클릭 시 회원가입 모달이 닫히고 로그인 모달로 전환된다", async () => {
			const mockCloseSignup = jest.fn();
			const mockOpenLogin = jest.fn();
			jest.mocked(useModalStore).mockReturnValue({
				signupOpen: true,
				closeSignup: mockCloseSignup,
				openLogin: mockOpenLogin,
			});
			render(<SignUpModal />);

			const user = userEvent.setup();
			await user.click(screen.getByRole("button", { name: "로그인" }));
			expect(mockCloseSignup).toHaveBeenCalled();
			expect(mockOpenLogin).toHaveBeenCalled();
		});
	});
});
