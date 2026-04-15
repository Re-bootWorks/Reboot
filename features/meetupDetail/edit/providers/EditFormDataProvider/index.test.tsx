import EditFormDataProvider, {
	useEditFormData,
} from "@/features/meetupDetail/edit/providers/EditFormDataProvider/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";

function Consumer() {
	const { data, setData } = useEditFormData();
	return (
		<>
			<span data-testid="name">{data.name}</span>
			<button onClick={() => setData((prev) => ({ ...prev, name: "수정된 모임" }))}>
				이름 변경
			</button>
		</>
	);
}

// ─────────────────────────────────────────────
// EditFormDataProvider
// ─────────────────────────────────────────────
describe("모임 수정 폼 데이터 Context Provider", () => {
	it("initialData가 Context에 정상적으로 전달된다.", () => {
		render(
			<EditFormDataProvider isOpen={true} initialData={mockEditInitialData}>
				<Consumer />
			</EditFormDataProvider>,
		);
		expect(screen.getByTestId("name")).toHaveTextContent("달램핏 모임");
	});

	it("isOpen이 false가 되면, initialData로 리셋된다.", async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<EditFormDataProvider isOpen={true} initialData={mockEditInitialData}>
				<Consumer />
			</EditFormDataProvider>,
		);

		await user.click(screen.getByRole("button", { name: "이름 변경" }));
		expect(screen.getByTestId("name")).toHaveTextContent("수정된 모임");

		rerender(
			<EditFormDataProvider isOpen={false} initialData={mockEditInitialData}>
				<Consumer />
			</EditFormDataProvider>,
		);
		expect(screen.getByTestId("name")).toHaveTextContent("달램핏 모임");
	});
});
