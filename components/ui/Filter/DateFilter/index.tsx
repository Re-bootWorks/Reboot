"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { formatDateString, getKoreanToday, parseDateString } from "@/utils/date";
import Calendar from "@/components/ui/Pickers/DatePicker/Calendar";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import Button from "@/components/ui/Buttons/Button";
import FilterTrigger from "@/components/ui/Filter/FilterTrigger";
import { useIsLg } from "@/hooks/useIsLg";
import { cn } from "@/utils/cn";

export type DateFilterValue = {
	from: string;
	to: string;
};

type DateFilterProps = {
	value: DateFilterValue;
	onChange: (value: DateFilterValue) => void;
};

function formatDisplayDate(date: Date) {
	return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatDisplayRange(range?: DateRange) {
	if (!range?.from) return "날짜 전체";
	if (!range.to) return formatDisplayDate(range.from);

	const from = formatDisplayDate(range.from);
	const to = formatDisplayDate(range.to);

	if (from === to) {
		const [month, day] = from.split("/");
		return `${month}월 ${day}일`;
	}

	return `${from} ~ ${to}`;
}

function formatDateRangeValue(range?: DateRange): DateFilterValue {
	if (!range?.from) {
		return { from: "", to: "" };
	}

	const from = formatDateString(range.from);
	const to = formatDateString(range.to ?? range.from);

	return { from, to };
}

function parseDateRangeValue(value: DateFilterValue): DateRange | undefined {
	if (!value.from) return undefined;

	const fromDate = parseDateString(value.from);
	const toDate = value.to ? parseDateString(value.to) : undefined;

	if (!fromDate) return undefined;
	if (value.to && !toDate) return undefined;

	return {
		from: fromDate,
		to: toDate,
	};
}

export default function DateFilter({ value = { from: "", to: "" }, onChange }: DateFilterProps) {
	const [month, setMonth] = useState<Date>(getKoreanToday());
	const isLg = useIsLg();
	const parsedRange = useMemo(() => parseDateRangeValue(value), [value.from, value.to]);
	const [draftRange, setDraftRange] = useState<DateRange | undefined>(parsedRange);

	useEffect(() => {
		setDraftRange(parsedRange);
	}, [parsedRange]);

	return (
		<Popover className="relative">
			{({ close }) => (
				<>
					<PopoverButton as="div">
						<FilterTrigger isActive={!!parsedRange?.from}>
							<span>{formatDisplayRange(parsedRange)}</span>
							<IcChevronDown className="h-4 w-4" />
						</FilterTrigger>
					</PopoverButton>

					<PopoverPanel
						className={cn(
							"absolute z-20 mt-2 w-74.5 rounded-xl border border-gray-200 bg-white p-6 shadow-xl",
							isLg ? "right-0" : "left-0",
						)}>
						<Calendar
							mode="range"
							month={month}
							selectedDate={draftRange}
							onMonthChange={setMonth}
							onSelectDate={setDraftRange}
						/>

						<div className="mt-3 grid grid-cols-2 gap-3">
							<Button
								sizes="small"
								colors="purpleBorder"
								onClick={() => {
									setDraftRange(undefined);
									onChange({ from: "", to: "" });
									close();
								}}>
								초기화
							</Button>

							<Button
								sizes="small"
								onClick={() => {
									onChange(formatDateRangeValue(draftRange));
									close();
								}}>
								적용
							</Button>
						</div>
					</PopoverPanel>
				</>
			)}
		</Popover>
	);
}
