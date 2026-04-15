import { render, screen } from "@testing-library/react";
import Toast, { ToastBox } from ".";

describe("toast box 확인", () => {
	test("메세지가 렌더링 되는지 확인", () => {
		render(<ToastBox>토스트 메세지</ToastBox>);

		const toast = screen.getByText("토스트 메세지");
		expect(toast).toBeInTheDocument();
	});
});
describe("toast 확인", () => {
	test("토스트가 portal로 목록 개수만큼 렌더링 되는지 확인", async () => {
		render(
			<Toast
				toasts={[
					{ id: 1, message: "로그인에 성공했습니다", status: "success" },
					{ id: 2, message: "로그인에 실패했습니다", status: "error" },
				]}
			/>,
		);

		const success = await screen.findByText("로그인에 성공했습니다");
		expect(success).toBeInTheDocument();

		const error = await screen.findByText("로그인에 실패했습니다");
		expect(error).toBeInTheDocument();

		const messages = await screen.findAllByText(/로그인/);
		expect(messages).toHaveLength(2);
	});
});
