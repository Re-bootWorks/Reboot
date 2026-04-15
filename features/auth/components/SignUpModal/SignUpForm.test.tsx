import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "./SignUpForm";
import { useSignUp } from "../../mutations";

jest.mock("../../mutations", () => ({
	useSignUp: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
	useOAuthLogin: jest.fn().mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

describe("SignUpForm 테스트", () => {
	beforeEach(() => {
		render(<SignUpForm onSuccess={jest.fn()} />);
	});

	describe("유효성 검사", () => {
		it("닉네임을 입력하지 않고 필드를 벗어나면 에러 메시지가 표시된다", async () => {
			const user = userEvent.setup();
			await user.click(screen.getByRole("textbox", { name: "닉네임 *" }));
			await user.tab();
			expect(await screen.findByText("닉네임은 필수 입력 항목입니다.")).toBeInTheDocument();
		});
		it("닉네임이 8글자 초과라면 에러 메시지가 표시된다", async () => {
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "닉네임 *" }), "test1231233");
			await user.tab();
			expect(await screen.findByText("닉네임은 8자 이하로 입력해주세요.")).toBeInTheDocument();
		});
		it("이메일 형식이 틀리면 에러 메시지가 표시된다", async () => {
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "abc123");
			await user.tab();
			expect(await screen.findByText("이메일 형식이 아닙니다.")).toBeInTheDocument();
		});
		it("비밀번호 8자 미만이면 에러 메시지가 표시된다", async () => {
			const user = userEvent.setup();
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "123123");
			await user.tab();
			expect(await screen.findByText("8자 이상 입력해주세요."));
		});
		it("비밀번호가 일치하지 않으면 에러 메시지가 표시된다", async () => {
			const user = userEvent.setup();
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "password123");
			await user.type(
				screen.getByPlaceholderText("비밀번호를 한 번 더 입력해주세요"),
				"passw121212",
			);
			await user.tab();
			expect(await screen.findByText("비밀번호가 일치하지 않습니다."));
		});
	});

	describe("버튼 상태", () => {
		it("초기 상태에서 회원가입 버튼이 비활성화된다", () => {
			expect(screen.getByRole("button", { name: "회원가입" })).toBeDisabled();
		});
		it("모든 필드를 올바르게 입력 시 회원가입 버튼이 활성화된다", async () => {
			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "닉네임 *" }), "테스트");
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "test@example.com");
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "password123");
			await user.type(
				screen.getByPlaceholderText("비밀번호를 한 번 더 입력해주세요"),
				"password123",
			);
			expect(screen.getByRole("button", { name: "회원가입" })).toBeEnabled();
		});
	});

	describe("클릭 검사", () => {
		it("유효한 값 입력 후 회원가입 버튼을 누르면 회원가입 API가 호출된다", async () => {
			const mockMutate = jest.fn();
			jest.mocked(useSignUp).mockReturnValue({ mutate: mockMutate, isPending: false } as never);

			const user = userEvent.setup();
			await user.type(screen.getByRole("textbox", { name: "닉네임 *" }), "테스트");
			await user.type(screen.getByRole("textbox", { name: "아이디 *" }), "test@example.com");
			await user.type(screen.getByPlaceholderText("비밀번호를 입력해주세요"), "password123");
			await user.type(
				screen.getByPlaceholderText("비밀번호를 한 번 더 입력해주세요"),
				"password123",
			);
			await user.click(screen.getByRole("button", { name: "회원가입" }));
			expect(mockMutate).toHaveBeenCalledWith({
				name: "테스트",
				email: "test@example.com",
				password: "password123",
			});
		});
	});
});
