"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { formatDateString, getKoreanToday, parseDateString } from "@/utils/date";
import Calendar from "@/components/ui/Pickers/DatePicker/Calendar";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/Buttons/Button";

type DateFilterProps = {
	value?: string;
	onChange?: (value: string) => void;
};

function formatDisplayDate(date: Date) {
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function DateFilter({ value = "", onChange }: DateFilterProps) {
	const [month, setMonth] = useState<Date>(getKoreanToday());
	const [draftDate, setDraftDate] = useState<Date | undefined>();
	const [isMd, setIsMd] = useState(false);

	useEffect(() => {
		const check = () => setIsMd(window.innerWidth >= 744);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const parsed = parseDateString(value);

	return (
		<Popover className="relative">
			{({ close }) => (
				<>
					<PopoverButton
						className={cn(
							"flex cursor-pointer items-center gap-1 px-2 py-1 text-base font-medium whitespace-nowrap focus:outline-none",
							parsed ? "text-gray-900" : "text-gray-600",
						)}>
						<span>{parsed ? formatDisplayDate(parsed) : "날짜 전체"}</span>
						<IcChevronDown color="currentColor" />
					</PopoverButton>

					<PopoverPanel
						anchor={{ to: isMd ? "bottom end" : "bottom start" }}
						className="z-20 mt-2 w-74.5 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
						<Calendar
							month={month}
							selectedDate={draftDate}
							onMonthChange={setMonth}
							onSelectDate={setDraftDate}
						/>

						<div className="mt-3 grid grid-cols-2 gap-3">
							<Button sizes="small" colors="purpleBorder" onClick={() => setDraftDate(undefined)}>
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
				</>
			)}
		</Popover>
	);
}
