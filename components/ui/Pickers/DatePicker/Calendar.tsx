import { cn } from "@/utils/cn";
import { DayPicker, type DateRange } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { IcArrowRight } from "../../icons";

type BaseCalendarProps = {
	month: Date;
	onMonthChange: (month: Date) => void;
};

type SingleCalendarProps = BaseCalendarProps & {
	mode?: "single";
	selectedDate?: Date;
	onSelectDate: (date: Date | undefined) => void;
};

type RangeCalendarProps = BaseCalendarProps & {
	mode: "range";
	selectedDate?: DateRange;
	onSelectDate: (date: DateRange | undefined) => void;
};

type CalendarProps = SingleCalendarProps | RangeCalendarProps;

const calendarFormatters = {
	formatCaption: (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
};

const calendarComponents = {
	Chevron: ({
		orientation,
		className: iconClassName,
	}: {
		orientation?: "up" | "down" | "left" | "right";
		className?: string;
		size?: number;
		disabled?: boolean;
	}) => (
		<IcArrowRight
			size="md"
			color="gray-800"
			className={cn(orientation === "left" && "rotate-180", iconClassName)}
		/>
	),
};

export default function Calendar(props: CalendarProps) {
	const isRangeMode = props.mode === "range";

	const commonProps = {
		locale: ko,
		month: props.month,
		onMonthChange: props.onMonthChange,
		showOutsideDays: true,
		fixedWeeks: true,
		formatters: calendarFormatters,
		components: calendarComponents,
		className: "p-0",
		classNames: {
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
			weeks: "flex flex-col gap-0",
			week: "grid grid-cols-7",
			day: "flex h-8 items-center justify-center p-0",
			day_button: cn(
				"relative z-10 flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors focus:outline-none select-none",
				isRangeMode
					? "rounded-full text-gray-800 hover:bg-purple-100"
					: "w-full rounded-lg text-gray-800 hover:bg-purple-100",
			),

			selected: isRangeMode
				? ""
				: "[&>button]:bg-purple-200 [&>button]:font-semibold [&>button]:text-purple-600",

			range_start:
				"rounded-l-2xl bg-purple-100 [&>button]:bg-purple-200 [&>button]:font-semibold [&>button]:text-purple-600",
			range_middle:
				"bg-purple-100 [&>button]:bg-transparent [&>button]:text-purple-600 [&>button]:rounded-none",
			range_end:
				"rounded-r-2xl bg-purple-100 [&>button]:bg-purple-200 [&>button]:font-semibold [&>button]:text-purple-600",

			today: "[&>button]:text-purple-600",
			outside: "[&>button]:text-gray-400",
			disabled: "[&>button]:cursor-not-allowed [&>button]:text-gray-100",
			hidden: "invisible",
		},
	};

	if (props.mode === "range") {
		return (
			<DayPicker
				{...commonProps}
				mode="range"
				selected={props.selectedDate}
				onSelect={props.onSelectDate}
			/>
		);
	}

	return (
		<DayPicker
			{...commonProps}
			mode="single"
			selected={props.selectedDate}
			onSelect={props.onSelectDate}
		/>
	);
}
