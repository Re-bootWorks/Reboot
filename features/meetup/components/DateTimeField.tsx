"use client";

import { InputFieldWrapper } from "@/components/ui/Inputs/InputFieldWrapper";
import DatePicker from "@/components/ui/Pickers/DatePicker";
import TimePicker from "@/components/ui/Pickers/TimePicker";

interface DateTimeFieldProps {
	/** 필드 라벨 */
	label: string;
	/** 날짜 값 */
	date: string;
	/** 시간 값 */
	time: string;
	/** 날짜 값 변경 함수 */
	onDateChange: (value: string) => void;
	/** 시간 값 변경 함수 */
	onTimeChange: (value: string) => void;
	/** 날짜 필드 이름 @default "date" */
	dateName?: string;
	/** 시간 필드 이름 @default "time" */
	timeName?: string;
	/** 추가 클래스명 */
	className?: string;
}

export type DateTime = {
	date: string;
	time: string;
};
export default function DateTimeField({
	label,
	date,
	time,
	onDateChange,
	onTimeChange,
	dateName = "date",
	timeName = "time",
	className,
}: DateTimeFieldProps) {
	return (
		<InputFieldWrapper label={label} isRequired className={className}>
			{({ id }) => (
				<div role="group" aria-labelledby={id} className="flex gap-x-3">
					<DatePicker
						id={id}
						name={dateName}
						placeholder="YYYY-MM-DD"
						isRequired
						onChange={onDateChange}
						value={date}
						aria-labelledby={id}
					/>
					<TimePicker
						name={timeName}
						placeholder="00 : 00"
						isRequired
						onChange={onTimeChange}
						value={time}
						aria-labelledby={id}
					/>
				</div>
			)}
		</InputFieldWrapper>
	);
}
