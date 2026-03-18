"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useState } from "react";
import { formatDateString, getKoreanToday } from "@/utils/date";
import Calendar from "@/components/ui/Pickers/DatePicker/Calendar";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import { parseDateString } from "@/utils/date";
import { cn } from "@/utils/cn";

function formatDisplayDate(date: Date) {
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
export default function DateFilter() {
	const [date, setDate] = useState<string>("");
	const [month, setMonth] = useState<Date>(getKoreanToday());
	const [draftDate, setDraftDate] = useState<Date | undefined>();
	const parsed = parseDateString(date);

	return (
		<Popover className="relative">
			{({ close }) => (
				<>
					<PopoverButton
						className={cn(
							"flex items-center gap-1 px-2 py-1 text-base leading-6 font-medium tracking-[-0.32px] whitespace-nowrap",
							parsed ? "text-gray-900" : "text-gray-600",
						)}>
						<span>{parsed ? formatDisplayDate(parsed) : "날짜 전체"}</span>
						<IcChevronDown size={16} color={parsed ? "gray-900" : "gray-500"} />
					</PopoverButton>

					<PopoverPanel
						anchor={{ to: "bottom start" }}
						className="z-20 mt-2 w-[300px] rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
						<Calendar
							month={month}
							selectedDate={draftDate}
							onMonthChange={setMonth}
							onSelectDate={setDraftDate}
						/>

						<div className="mt-3 flex gap-2">
							<button
								onClick={() => setDraftDate(undefined)}
								className="flex-1 rounded-lg border border-purple-500 px-3 py-1 text-sm text-purple-500">
								초기화
							</button>

							<button
								onClick={() => {
									setDate(draftDate ? formatDateString(draftDate) : "");
									close();
								}}
								className="flex-1 rounded-lg bg-purple-500 px-3 py-1 text-sm text-white">
								적용
							</button>
						</div>
					</PopoverPanel>
				</>
			)}
		</Popover>
	);
}
