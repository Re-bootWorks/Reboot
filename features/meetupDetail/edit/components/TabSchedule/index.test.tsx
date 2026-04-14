import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabSchedule from "@/features/meetupDetail/edit/components/TabSchedule/index";
import EditFormDataProvider, {
	useEditFormData,
} from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";

jest.mock("@/features/meetupDetail/components/PersonnelContainer", () => ({
	MIN_CONFIRMED_COUNT: 3,
}));

function DataChecker() {
	const { data } = useEditFormData();
	return (
		<>
			<span data-testid="data-capacity">{data.capacity}</span>
		</>
	);
}

function renderWithProvider() {
	return render(
		<EditFormDataProvider isOpen={true} initialData={mockEditInitialData}>
			<TabSchedule />
			<DataChecker />
		</EditFormDataProvider>,
	);
}

// ─────────────────────────────────────────────
// TabSchedule
// ─────────────────────────────────────────────
describe("모임 수정 일정 및 인원 탭 컴포넌트", () => {
	it("정원 변경 시 Context의 capacity가 업데이트된다", async () => {
		const user = userEvent.setup();
		renderWithProvider();
		const capacityInput = screen.getByRole("spinbutton", { name: "모임 정원 *" });
		await user.clear(capacityInput);
		await user.type(capacityInput, "20");
		expect(screen.getByTestId("data-capacity")).toHaveTextContent("20");
	});
});
