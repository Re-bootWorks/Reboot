import TypeSelectField from "@/features/meetupDetail/edit/components/TypeSelectField/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─────────────────────────────────────────────
// TypeSelectField
// ─────────────────────────────────────────────
describe("모임 종류 선택 필드 컴포넌트", () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("렌더링", () => {
		it("스토어의 카테고리 옵션들이 렌더링된다", async () => {
			const user = userEvent.setup();
			render(<TypeSelectField value="" onChange={mockOnChange} />);
			await user.click(screen.getByRole("button", { name: /모임 종류/ }));
			expect(screen.getByRole("option", { name: "자기계발" })).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "운동/스포츠" })).toBeInTheDocument();
			expect(screen.getByRole("option", { name: "문화생활" })).toBeInTheDocument();
		});
	});

	describe("onChange 변화", () => {
		it("옵션 클릭 시, onChange가 선택한 값과 함께 호출된다.", async () => {
			const user = userEvent.setup();
			render(<TypeSelectField value="" onChange={mockOnChange} />);
			await user.click(screen.getByRole("button", { name: /모임 종류/ }));
			await user.click(screen.getByRole("option", { name: "운동/스포츠" }));
			expect(mockOnChange).toHaveBeenCalledWith("운동/스포츠");
		});

		it("다른 옵션 클릭 시, onChange가 해당 값으로 호출된다.", async () => {
			const user = userEvent.setup();
			render(<TypeSelectField value="자기계발" onChange={mockOnChange} />);

			await user.click(screen.getByRole("button", { name: /모임 종류/ }));
			await user.click(screen.getByRole("option", { name: "여행" }));
			expect(mockOnChange).toHaveBeenCalledWith("여행");

			await user.click(screen.getByRole("button", { name: /모임 종류/ }));
			await user.click(screen.getByRole("option", { name: "문화생활" }));
			expect(mockOnChange).toHaveBeenCalledWith("문화생활");
		});
	});
});
