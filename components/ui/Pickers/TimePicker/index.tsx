"use client";

import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Popover,
	PopoverButton,
	PopoverPanel,
} from "@headlessui/react";
import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import InputField from "../../Inputs/InputField";
import { IcClockOutline } from "../../icons";
import { TimeListboxProps, TimePickerProps, TimeValue } from "./types";

/** 시간 선택 리스트에 보여줄 00 ~ 23시 옵션 */
const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));

/** 분 선택 리스트에 보여줄 00 ~ 55분 옵션 (5분 단위) */
const MINUTES = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

/**
 * 부모에게서 받은 문자열 시간을
 * 내부에서 다루기 쉬운 { hour, minute } 형태로 변환
 *
 * - 값이 없거나
 * - "HH:mm" 형식이 아니거나
 * - 허용된 HOURS MINUTES 값이 아니면
 * 빈 값으로 초기화
 */
const parseTimeString = (value?: string): TimeValue => {
	if (!value) {
		return {
			hour: "",
			minute: "",
		};
	}

	const [hour, minute] = value.split(":");

	if (!hour || !minute) {
		return {
			hour: "",
			minute: "",
		};
	}

	if (!HOURS.includes(hour) || !MINUTES.includes(minute)) {
		return {
			hour: "",
			minute: "",
		};
	}

	return { hour, minute };
};

/** 부모로 전달할 실제 저장용 시간 문자열 생성 ("HH:mm") */
const formatTimeValue = (hour: string, minute: string) => `${hour}:${minute}`;

/**
 * 인풋에 보여줄 출력용 시간 문자열 생성 ("HH : mm")
 * 둘 다 비어 있으면 placeholder가 보이도록 빈 문자열 반환
 */
const formatTimeDisplay = (hour: string, minute: string) => {
	if (!hour && !minute) {
		return "";
	}

	return `${hour} : ${minute}`;
};

function TimeListbox({ label, unit, value, options, onChange }: TimeListboxProps) {
	return (
		<div className="min-w-0 flex-1">
			<Listbox value={value} onChange={onChange}>
				<ListboxButton className="sr-only">
					{value ? `${label} 선택됨: ${value}${unit}` : `${label} 선택 안됨`}
				</ListboxButton>

				<ListboxOptions
					static
					aria-label={label}
					className="scrollbar-hide max-h-60.5 overflow-y-auto overscroll-contain px-2 py-2.5 outline-none">
					<div className="flex flex-col gap-2.5">
						{options.map((option) => {
							/** 현재 옵션이 선택된 값인지 여부 */
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
	value,
	onChange,
	label,
	isRequired = false,
	placeholder = "00 : 00",
	hintText,
	isDestructive = false,
	className,
	readOnly,
	disabled,
	name,
	...props
}: TimePickerProps) {
	/**
	 * 부모가 내려준 확정값(value)을
	 * 내부에서 hour / minute 으로 나눈 결과
	 */
	const selectedTime = useMemo(() => parseTimeString(value), [value]);

	/**
	 * 트리거 버튼 측에 보여줄 출력용 문자열
	 */
	const displayValue = formatTimeDisplay(selectedTime.hour, selectedTime.minute);

	/** 패널 안에서 사용자가 임시로 고른 '시' */
	const [draftHour, setDraftHour] = useState<string>(selectedTime.hour);

	/** 패널 안에서 사용자가 임시로 고른 '분' */
	const [draftMinute, setDraftMinute] = useState<string>(selectedTime.minute);

	return (
		<Popover className={cn("relative w-full", className)}>
			{({ open }) => {
				/**
				 * 패널을 열 때
				 * 현재 확정값(value)을 draft 상태로 다시 맞춤
				 *
				 * 즉, 이전에 열었다가 닫은 임시 선택값이 아니라
				 * 현재 실제 선택된 값 기준으로 패널이 열리게 함
				 */
				const syncDraftFromValue = () => {
					setDraftHour(selectedTime.hour);
					setDraftMinute(selectedTime.minute);
				};

				/**
				 * 시간(시) 선택 시 호출
				 * draftHour만 우선 바꾸고
				 * 분까지 이미 선택되어 있으면 부모에 최종값 전달
				 */
				const handleHourChange = (nextHour: string) => {
					setDraftHour(nextHour);

					if (nextHour && draftMinute) {
						onChange?.(formatTimeValue(nextHour, draftMinute));
					}
				};

				/**
				 * 분 선택 시 호출
				 * draftMinute만 우선 바꾸고
				 * 시까지 이미 선택되어 있으면 부모에 최종값 전달
				 */
				const handleMinuteChange = (nextMinute: string) => {
					setDraftMinute(nextMinute);

					if (draftHour && nextMinute) {
						onChange?.(formatTimeValue(draftHour, nextMinute));
					}
				};

				return (
					<>
						<InputField
							{...props}
							label={label}
							isRequired={isRequired}
							value={displayValue}
							placeholder={placeholder}
							readOnly
							disabled={disabled}
							inputClassName={cn(open && "border-purple-500")}
							leftIcon={<IcClockOutline className="size-4.5 text-gray-800 md:size-6" />}
							hintText={hintText}
							isDestructive={isDestructive}
						/>

						{/* form submit 시 실제 전송할 값("HH:mm")용 hidden input */}
						{name ? <input type="hidden" name={name} value={value} /> : ""}

						{!disabled && !readOnly && (
							<PopoverButton
								type="button"
								aria-label={
									selectedTime.hour && selectedTime.minute
										? `${label ?? "시간"} 선택 열기. 현재 선택된 시간 ${selectedTime.hour}시 ${selectedTime.minute}분`
										: `${label ?? "시간"} 선택 열기`
								}
								onClick={syncDraftFromValue}
								className={cn(
									"absolute inset-x-0 z-20 cursor-pointer rounded-[10px] outline-none md:rounded-xl",
									label ? "bottom-0 h-10 md:h-12" : "top-0 h-10 md:h-12",
								)}
							/>
						)}

						{open && !disabled && !readOnly && (
							<PopoverPanel
								anchor="bottom start"
								className="z-20 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white p-0 md:mt-2">
								<div className="relative flex bg-white p-3">
									<TimeListbox
										label="시간"
										unit="시"
										value={draftHour || ""}
										options={HOURS}
										onChange={handleHourChange}
									/>
									<div className="mx-2.5 w-px self-stretch bg-gray-300" />
									<TimeListbox
										label="분"
										unit="분"
										value={draftMinute || ""}
										options={MINUTES}
										onChange={handleMinuteChange}
									/>
								</div>
							</PopoverPanel>
						)}
					</>
				);
			}}
		</Popover>
	);
}
