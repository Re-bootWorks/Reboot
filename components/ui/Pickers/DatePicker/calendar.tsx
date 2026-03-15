import { cn } from "@/utils/cn";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { IcArrowRight } from "../../icons";

type CalendarProps = {
	month: Date;
	selectedDate?: Date;
	onMonthChange: (month: Date) => void;
	onSelectDate: (date: Date | undefined) => void;
};

export default function Calendar({
	month,
	selectedDate,
	onMonthChange,
	onSelectDate,
}: CalendarProps) {
	return (
		<DayPicker
			mode="single"
			locale={ko}
			month={month}
			selected={selectedDate}
			onMonthChange={onMonthChange}
			showOutsideDays
			fixedWeeks
			onSelect={onSelectDate}
			formatters={{
				formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
			}}
			components={{
				Chevron: ({ orientation, className: iconClassName }) => (
					<IcArrowRight
						size="md"
						color="gray-800"
						className={cn(orientation === "left" && "rotate-180", iconClassName)}
					/>
				),
			}}
			className="p-0"
			classNames={{
				root: "w-full",
				months: "flex flex-col",
				month: "p-0",
				month_caption: "flex h-8 justify-center select-none",
				caption: "relative flex h-20 items-center justify-center",
				caption_label: "text-sm font-semibold text-gray-800",
				nav: "contents",
				button_previous:
					"absolute top-8.5 left-7 -translate-y-1/2 cursor-pointer bg-transparent p-0 hover:bg-transparent",
				button_next:
					"absolute top-8.5 right-7 -translate-y-1/2 cursor-pointer bg-transparent p-0 hover:bg-transparent",
				month_grid: "w-full border-collapse",
				weekdays: "grid grid-cols-7",
				weekday:
					"flex h-8 items-center justify-center text-center text-sm font-semibold text-gray-600 select-none",
				weeks: "flex flex-col",
				week: "grid grid-cols-7",
				day: "flex items-center justify-center",
				day_button: cn(
					"flex h-8 w-full cursor-pointer items-center justify-center rounded-lg",
					"text-sm font-medium text-gray-800",
					"transition-colors",
					"hover:bg-purple-100",
					"focus:outline-none",
				),
				selected: "[&>button]:bg-purple-200 [&>button]:font-semibold [&>button]:text-purple-600",
				today: "[&>button]:text-purple-600",
				outside: "[&>button]:text-gray-400",
				disabled: "[&>button]:cursor-not-allowed [&>button]:text-gray-100",
				hidden: "invisible",
			}}
		/>
	);
}
