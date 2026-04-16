import { render, screen } from "@testing-library/react";
import QueryErrorBoundary from ".";
import userEvent from "@testing-library/user-event";

function ThrowError(): never {
	throw new Error("테스트 에러");
}
describe("QueryErrorBoundary", () => {
	const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

	afterEach(() => {
		consoleError.mockClear();
	});

	afterAll(() => {
		consoleError.mockRestore();
	});

	test("자식 컴포넌트에서 에러가 발생하면 fallback UI가 렌더되는지 확인", () => {
		render(
			<QueryErrorBoundary prefix="목록을 ">
				<ThrowError />
			</QueryErrorBoundary>,
		);

		const title = screen.getByText("목록을 불러오지 못했습니다.");
		const description = screen.getByText("잠시 후 다시 시도해주세요.");
		const button = screen.getByRole("button", { name: "다시 시도" });

		expect(title).toBeInTheDocument();
		expect(description).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});
	test("다시 시도 버튼 클릭시 reset 후 자식컴포넌트를 리렌더링하는지 확인 ", async () => {
		const user = userEvent.setup();

		let isError = true;

		function TestComponent() {
			if (isError) {
				throw new Error("초기 에러");
			}
			return <div>복구된 콘텐츠</div>;
		}

		render(
			<QueryErrorBoundary prefix="목록을 ">
				<TestComponent />
			</QueryErrorBoundary>,
		);

		const title = screen.getByText("목록을 불러오지 못했습니다.");
		expect(title).toBeInTheDocument();

		isError = false;

		const button = screen.getByRole("button", { name: "다시 시도" });
		await user.click(button);

		const content = await screen.findByText("복구된 콘텐츠");
		expect(content).toBeInTheDocument();
	});
});
