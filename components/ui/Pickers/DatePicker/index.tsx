"use client";

import type { ComponentProps } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { formatDateString, getKoreanToday, parseDateString } from "@/utils/date";
import Button from "../../Buttons/Button";
import Calendar from "./Calendar";
import InputField from "../../Inputs/InputField";
import { IcCalendarOutline } from "../../icons";

type DatePickerProps = Omit<
	ComponentProps<typeof InputField>,
	"type" | "value" | "defaultValue" | "onChange" | "leftIcon" | "rightIcon" | "onRightIconClick"
> & {
	value?: string;
	onChange?: (value: string) => void;
};

export default function DatePicker({
	value = "",
	onChange,
	label,
	isRequired = false,
	placeholder = "YYYY-MM-DD",
	className,
	readOnly,
	disabled,
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
			{({ close, open }) => (
				<>
					<div className={cn("relative w-full", className)}>
						<InputField
							label={label}
							isRequired={isRequired}
							value={value}
							placeholder={placeholder}
							readOnly
							disabled={disabled}
							leftIcon={<IcCalendarOutline className="size-4.5 text-gray-800 md:size-6" />}
							{...props}
						/>

						{!disabled && !readOnly && (
							<div
								aria-hidden="true"
								className={cn(
									"pointer-events-none absolute inset-x-0 z-10 rounded-[10px] border transition-colors md:rounded-[12px]",
									label ? "bottom-0 h-10 md:h-12" : "top-0 h-10 md:h-12",
									open ? "border-purple-500" : "border-transparent",
								)}
							/>
						)}

						{!disabled && !readOnly && (
							<PopoverButton
								type="button"
								aria-label="날짜 선택 열기"
								onClick={() => {
									setDraftDate(selectedDate);
									setMonth(selectedDate ?? getKoreanToday());
								}}
								className={cn(
									"absolute inset-x-0 z-20 cursor-pointer rounded-[10px] outline-none md:rounded-[12px]",
									label ? "bottom-0 h-10 md:h-12" : "top-0 h-10 md:h-12",
								)}
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
