import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/features/auth/components/LoginModal/LoginForm";
import { useLogin } from "@/features/auth/mutations";

jest.mock("../../mutations", () => ({
	useLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
	useOAuthLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

describe("LoginForm 테스트", () => {
	describe("유효성 검사", () => {
		it("이메일 형식이 틀리면 에러 메시지가 표시된다", async () => {
			render(<LoginForm onSuccess={jest.fn()} />);
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "abc123");
			await user.tab();
			expect(await screen.findByText("이메일 형식이 아닙니다")).toBeInTheDocument();
		});
		it("비밀번호 8자 미만이면 에러 메시지가 표시된다", async () => {
			render(<LoginForm onSuccess={jest.fn()} />);
			const user = userEvent.setup();
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "123123");
			await user.tab();
			expect(await screen.findByText("8자 이상 입력해주세요.")).toBeInTheDocument();
		});
	});

	describe("버튼 상태", () => {
		it("초기 상태에서 로그인 버튼이 비활성화된다", () => {
			render(<LoginForm onSuccess={jest.fn()} />);
			expect(screen.getByRole("button", { name: "로그인" })).toBeDisabled();
		});
		it("이메일/비밀번호를 올바르게 입력 시 로그인 버튼이 활성화된다", async () => {
			render(<LoginForm onSuccess={jest.fn()} />);
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "test@example.com");
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "password123");
			expect(screen.getByRole("button", { name: "로그인" })).toBeEnabled();
		});
	});

	describe("클릭 검사", () => {
		it("유효한 값 입력 후 로그인 버튼을 누르면 로그인 API가 호출된다", async () => {
			const mockMutate = jest.fn();
			jest.mocked(useLogin).mockReturnValue({ mutate: mockMutate, isPending: false } as never);
			render(<LoginForm onSuccess={jest.fn()} />);
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "test@example.com");
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "password123");
			await user.click(screen.getByRole("button", { name: "로그인" }));
			expect(mockMutate).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "password123",
			});
		});
	});
});
