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
		// <DatePicker
		//   value={date}
		//   onChange={setDate}
		//   placeholder="날짜 전체"
		// />
		<></>
	);
}
