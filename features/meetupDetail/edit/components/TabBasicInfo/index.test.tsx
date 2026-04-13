import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabBasicInfo from "@/features/meetupDetail/edit/components/TabBasicInfo/index";
import EditFormDataProvider, {
	useEditFormData,
} from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";

jest.mock("@/features/meetup/components/AddressField", () => ({
	__esModule: true,
	default: ({ isComboOpened }: { isComboOpened: boolean }) => (
		<div data-testid="address-field" data-combo-opened={isComboOpened} />
	),
}));

jest.mock("@/features/meetup/components/FileField", () => ({
	__esModule: true,
	default: () => <div data-testid="file-field" />,
}));

// Context 데이터를 확인하는 테스트용 컴포넌트
function DataChecker() {
	const { data } = useEditFormData();
	return (
		<div>
			<span data-testid="data-type">{data.type}</span>
			<span data-testid="data-name">{data.name}</span>
		</div>
	);
}

function renderWithProvider(initialOpen = true) {
	return render(
		<EditFormDataProvider isOpen={initialOpen} initialData={mockEditInitialData}>
			<TabBasicInfo />
			<DataChecker />
		</EditFormDataProvider>,
	);
}

// ─────────────────────────────────────────────
// TabBasicInfo
// ─────────────────────────────────────────────
describe("모임 수정 기본 정보 탭 컴포넌트", () => {
	it("모임 이름 변경 시 Context의 name이 업데이트된다", async () => {
		const user = userEvent.setup();
		renderWithProvider();
		await user.clear(screen.getByDisplayValue("달램핏 모임"));
		await user.type(screen.getByRole("textbox", { name: /모임 이름/ }), "새로운 모임");
		expect(screen.getByTestId("data-name")).toHaveTextContent("새로운 모임");
	});

	it("모임 종류 변경 시 Context의 type이 업데이트된다", async () => {
		const user = userEvent.setup();
		renderWithProvider();
		await user.click(screen.getByRole("button", { name: "모임 종류 달램핏" }));
		await user.click(screen.getByRole("option", { name: "운동/스포츠" }));
		expect(screen.getByTestId("data-type")).toHaveTextContent("운동/스포츠");
	});

	it("fieldset 클릭 시 isComboOpened가 false로 닫힌다", async () => {
		const user = userEvent.setup();
		renderWithProvider();
		await user.click(screen.getByRole("group"));
		expect(screen.getByTestId("address-field")).toHaveAttribute("data-combo-opened", "false");
	});
});
