"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { IcCalendarOutline, IcClockOutline } from "../icons";

type PickerInputType = "calendar" | "clock";

export interface PickerInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	iconType?: PickerInputType;
}

const iconMap = {
	calendar: IcCalendarOutline,
	clock: IcClockOutline,
};

export default function PickerInput({
	label,
	iconType = "calendar",
	className,
	disabled,
	placeholder = "YYYY-MM-DD",
	id,
	...props
}: PickerInputProps) {
	const Icon = iconMap[iconType];

	return (
		<div className="flex w-full flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-sm font-medium text-gray-800">
					{label}
					<span className="ml-0.5 text-purple-500">*</span>
				</label>
			)}

			<div className="relative">
				<div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-800">
					<Icon className="size-4.5 md:size-6" />
				</div>

				<input
					id={id}
					type="text"
					disabled={disabled}
					placeholder={placeholder}
					className={cn(
						"h-10 w-full rounded-[0.625rem] bg-gray-50 pl-9 text-sm font-medium text-gray-500 transition-colors outline-none md:h-12 md:rounded-xl md:pl-11 md:text-base",
						"placeholder:text-gray-500",
						"border border-gray-50 focus:border-purple-500",
						"disabled:cursor-not-allowed disabled:text-gray-400",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
}
