"use client";

import type { ComponentProps } from "react";
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Popover,
	PopoverButton,
	PopoverPanel,
} from "@headlessui/react";
import { useMemo } from "react";
import { cn } from "@/utils/cn";
import InputField from "../../Inputs/InputField";
import { IcClockOutline } from "../../icons";

type TimePickerProps = Omit<
	ComponentProps<typeof InputField>,
	"type" | "value" | "defaultValue" | "onChange" | "leftIcon" | "rightIcon" | "onRightIconClick"
> & {
	value?: string;
	onChange?: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

const parseTimeString = (value?: string) => {
	if (!value) {
		return {
			hour: "00",
			minute: "00",
		};
	}

	const [hour, minute] = value.split(":");

	if (!hour || !minute) {
		return {
			hour: "00",
			minute: "00",
		};
	}

	if (!HOURS.includes(hour) || !MINUTES.includes(minute)) {
		return {
			hour: "00",
			minute: "00",
		};
	}

	return { hour, minute };
};

const formatTimeValue = (hour: string, minute: string) => `${hour}:${minute}`;
const formatTimeDisplay = (hour: string, minute: string) => `${hour} : ${minute}`;

type TimeListboxProps = {
	label: string;
	unit: string;
	value: string;
	options: string[];
	onChange: (value: string) => void;
};

function TimeListbox({ label, unit, value, options, onChange }: TimeListboxProps) {
	return (
		<div className="min-w-0 flex-1">
			<Listbox value={value} onChange={onChange}>
				<ListboxButton className="sr-only">{`${label} 선택됨: ${value}${unit}`}</ListboxButton>

				<ListboxOptions
					static
					aria-label={label}
					className="scrollbar-hide max-h-60.5 overflow-y-auto overscroll-contain px-2 py-2.5 outline-none">
					<div className="flex flex-col gap-2.5">
						{options.map((option) => {
							const isSelected = option === value;

							return (
								<ListboxOption
									key={option}
									value={option}
									aria-label={`${option}${unit}`}
									className="cursor-pointer list-none bg-white outline-none">
									<div
										aria-hidden="true"
										className={cn(
											"flex h-[2.063rem] w-fit items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors",
											isSelected ? "bg-purple-200 text-purple-600" : "bg-transparent text-gray-900",
										)}>
										{option}
									</div>
								</ListboxOption>
							);
						})}
					</div>
				</ListboxOptions>
			</Listbox>
		</div>
	);
}

export default function TimePicker({
	value = "",
	onChange,
	label,
	isRequired = false,
	placeholder = "00:00",
	className,
	readOnly,
	disabled,
	...props
}: TimePickerProps) {
	const { hour, minute } = useMemo(() => parseTimeString(value), [value]);
	const displayValue = formatTimeDisplay(hour, minute);
	const pickerLabel = label ?? "시간";

	const handleHourChange = (nextHour: string) => {
		onChange?.(formatTimeValue(nextHour, minute));
	};

	const handleMinuteChange = (nextMinute: string) => {
		onChange?.(formatTimeValue(hour, nextMinute));
	};

	return (
		<Popover className="relative w-full">
			{({ open }) => (
				<>
					<div className={cn("relative w-full", className)}>
						<InputField
							{...props}
							label={label}
							isRequired={isRequired}
							value={displayValue}
							placeholder={placeholder}
							readOnly
							disabled={disabled}
							leftIcon={<IcClockOutline className="size-4.5 text-gray-800 md:size-6" />}
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
								aria-label={`${pickerLabel} 선택 열기. 현재 선택된 시간 ${hour}시 ${minute}분`}
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
							aria-label={`${pickerLabel} 선택 패널`}
							className={cn(
								"z-20 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white p-0 md:mt-2",
								"origin-top transition duration-150 ease-out",
								"data-closed:scale-95 data-closed:opacity-0",
							)}>
							<div className="relative flex bg-white p-3">
								<TimeListbox
									label="시간"
									unit="시"
									value={hour}
									options={HOURS}
									onChange={handleHourChange}
								/>
								<div className="mx-2.5 w-px self-stretch bg-gray-300" />
								<TimeListbox
									label="분"
									unit="분"
									value={minute}
									options={MINUTES}
									onChange={handleMinuteChange}
								/>
							</div>
						</PopoverPanel>
					)}
				</>
			)}
		</Popover>
	);
}
