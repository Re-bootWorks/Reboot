import { render, screen } from "@testing-library/react";
import ErrorPage from ".";
import userEvent from "@testing-library/user-event";

describe("ErrorPage", () => {
	test("prefix, title, description을 전달하면 해당 문구와 다시시도 버튼이 렌더링된다 ", () => {
		render(
			<ErrorPage
				onRetryAction={() => {}}
				prefix="목록을 "
				title="불러오지 못했습니다."
				description="커스텀 설명입니다."
			/>,
		);
		const title = screen.getByText("목록을 불러오지 못했습니다.");
		const description = screen.getByText("커스텀 설명입니다.");
		const button = screen.getByRole("button", { name: "다시 시도" });

		expect(title).toBeInTheDocument();
		expect(description).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});

	test("다시 시도 버튼 클릭 시 onRetryAction이 호출된다", async () => {
		const user = userEvent.setup();
		const onRetryAction = jest.fn();
		render(<ErrorPage onRetryAction={onRetryAction} />);

		const button = screen.getByRole("button", { name: "다시 시도" });
		await user.click(button);

		expect(onRetryAction).toHaveBeenCalledTimes(1);
	});
});
