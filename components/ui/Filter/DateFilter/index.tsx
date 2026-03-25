"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { formatDateString, getKoreanToday, parseDateString } from "@/utils/date";
import Calendar from "@/components/ui/Pickers/DatePicker/Calendar";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import Button from "@/components/ui/Buttons/Button";
import FilterTrigger from "@/components/ui/Filter/FilterTrigger";

type DateFilterProps = {
	value: string;
	onChange: (value: string) => void;
};

function formatDisplayDate(date: Date) {
	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function DateFilter({ value = "", onChange }: DateFilterProps) {
	const [month, setMonth] = useState<Date>(getKoreanToday());
	const [draftDate, setDraftDate] = useState<Date | undefined>();

	const parsed = parseDateString(value);

	useEffect(() => {
		if (!draftDate) {
			setDraftDate(parsed || undefined);
		}
	}, [parsed]);

	return (
		<Popover className="relative">
			{({ close }) => (
				<>
					<PopoverButton as="div">
						<FilterTrigger isActive={!!parsed}>
							<span>{parsed ? formatDisplayDate(parsed) : "날짜 전체"}</span>
							<IcChevronDown className="h-4 w-4" />
						</FilterTrigger>
					</PopoverButton>

					<PopoverPanel className="absolute z-20 mt-2 w-74.5 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
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
									onChange(""); // 부모값 초기화
									close(); // 패널 닫기
								}}>
								초기화
							</Button>

							<Button
								sizes="small"
								onClick={() => {
									onChange(draftDate ? formatDateString(draftDate) : "");
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
