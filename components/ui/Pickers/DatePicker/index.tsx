"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { formatDateString, getKoreanToday, parseDateString } from "@/utils/date";
import PickerInput, { PickerInputProps } from "../PickerField";
import Button from "../../Buttons/Button";
import Calendar from "./Calendar";

type DatePickerProps = Omit<
	PickerInputProps,
	"type" | "value" | "defaultValue" | "onChange" | "iconType"
> & {
	value?: string;
	onChange?: (value: string) => void;
};

export default function DatePicker({
	value = "",
	onChange,
	label,
	required,
	placeholder = "YYYY-MM-DD",
	className,
	readOnly,
	disabled,
	id,
	...props
}: DatePickerProps) {
	const selectedDate = useMemo(() => parseDateString(value), [value]);
	const [month, setMonth] = useState<Date>(selectedDate ?? getKoreanToday());
	const [draftDate, setDraftDate] = useState<Date | undefined>(selectedDate);

	useEffect(() => {
		setDraftDate(selectedDate);

		if (selectedDate) {
			setMonth(selectedDate);
		}
	}, [selectedDate]);

	return (
		<Popover className="relative w-full">
			{({ close }) => (
				<>
					<div className={cn("relative w-full", className)}>
						<PickerInput
							id={id}
							label={label}
							required={required}
							iconType="calendar"
							value={value}
							placeholder={placeholder}
							readOnly
							disabled={disabled}
							className="pr-3"
							{...props}
						/>

						{!disabled && !readOnly && (
							<PopoverButton
								type="button"
								aria-label="날짜 선택 열기"
								onClick={() => {
									setDraftDate(selectedDate);
									setMonth(selectedDate ?? getKoreanToday());
								}}
								className="absolute inset-0 cursor-pointer rounded-[0.625rem] outline-none md:rounded-xl"
							/>
						)}
					</div>

					{!disabled && !readOnly && (
						<PopoverPanel
							anchor={{ to: "bottom start" }}
							transition
							className={cn(
								"z-20 w-74.5 rounded-xl border border-gray-200 bg-white p-6 shadow-xl",
								"origin-top transition duration-150 ease-out",
								"data-closed:scale-95 data-closed:opacity-0",
								"mt-1.5 md:mt-2",
							)}>
							<Calendar
								month={month}
								selectedDate={draftDate}
								onMonthChange={setMonth}
								onSelectDate={setDraftDate}
							/>

							<div className="mt-3 grid grid-cols-2 gap-3">
								<Button
									sizes="small"
									colors="purpleBorder"
									onClick={() => {
										setDraftDate(undefined);
									}}>
									초기화
								</Button>

								<Button
									sizes="small"
									onClick={() => {
										onChange?.(draftDate ? formatDateString(draftDate) : "");
										close();
									}}>
									적용
								</Button>
							</div>
						</PopoverPanel>
					)}
				</>
			)}
		</Popover>
	);
}
