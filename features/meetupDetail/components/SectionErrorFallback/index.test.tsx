import SectionErrorFallback from "@/features/meetupDetail/components/SectionErrorFallback/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockRefresh = jest.fn();
const mockResetErrorBoundary = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => ({ refresh: mockRefresh }),
}));

const renderComponent = () =>
	render(
		<SectionErrorFallback
			error={new Error("test error")}
			resetErrorBoundary={mockResetErrorBoundary}
		/>,
	);

// ─────────────────────────────────────────────
// SectionErrorFallback
// ─────────────────────────────────────────────
describe("섹션 데이터 로드 실패 시 노출되는 에러 폴백 컴포넌트", () => {
	beforeEach(() => {
		mockRefresh.mockClear();
		mockResetErrorBoundary.mockClear();
	});

	describe("다시 시도 버튼 클릭", () => {
		it("다시 시도 버튼 클릭 시 resetErrorBoundary와 router.refresh가 호출된다.", async () => {
			const user = userEvent.setup();
			renderComponent();
			await user.click(screen.getByRole("button", { name: "다시 시도" }));
			expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
			expect(mockRefresh).toHaveBeenCalledTimes(1);
		});

		it("resetErrorBoundary가 router.refresh보다 먼저 호출된다.", async () => {
			const callOrder: string[] = [];
			mockResetErrorBoundary.mockImplementation(() => callOrder.push("reset"));
			mockRefresh.mockImplementation(() => callOrder.push("refresh"));

			const user = userEvent.setup();
			renderComponent();
			await user.click(screen.getByRole("button", { name: "다시 시도" }));
			expect(callOrder).toEqual(["reset", "refresh"]);
		});
	});
});
