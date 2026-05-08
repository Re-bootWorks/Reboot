import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import DateTimeField from ".";

const dateLabelText = "날짜 선택 열기";
const timeLabelText = "시간 선택 열기";
const applyButtonText = "적용";

describe("DateTimeField 컴포넌트 테스트", () => {
	const onDateChange = jest.fn();
	const onTimeChange = jest.fn();

	function renderDateTimeField(props?: Partial<React.ComponentProps<typeof DateTimeField>>) {
		return render(
			<DateTimeField
				label="모임 날짜"
				date=""
				time=""
				onDateChange={onDateChange}
				onTimeChange={onTimeChange}
				{...props}
			/>,
		);
	}

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("날짜와 시간 값이 표시되어야 함", () => {
		const date = "2026-05-01";
		const time = "14:00";
		renderDateTimeField({ date, time });

		expect(screen.getByDisplayValue(date)).toBeInTheDocument();
		expect(screen.getByDisplayValue(time)).toBeInTheDocument();
	});

	test("날짜 선택 시 onDateChange가 호출되어야 함", async () => {
		const user = userEvent.setup();
		const date = "2026-05-01";
		renderDateTimeField({ date });

		await user.click(screen.getByLabelText(dateLabelText));
		const applyButton = screen.getByRole("button", { name: applyButtonText });
		await user.click(applyButton);

		expect(onDateChange).toHaveBeenCalledWith(date);
	});

	test("시, 분 선택 시 onTimeChange가 호출되어야 함", async () => {
		const user = userEvent.setup();
		renderDateTimeField();

		await user.click(screen.getByLabelText(timeLabelText));

		const hourOption = screen.getByRole("option", { name: "14시" });
		await user.click(hourOption);

		const minuteOption = screen.getByRole("option", { name: "30분" });
		await user.click(minuteOption);

		expect(onTimeChange).toHaveBeenCalledWith("14:30");
	});
});
