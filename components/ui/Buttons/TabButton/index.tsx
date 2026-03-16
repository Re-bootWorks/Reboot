import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	selected?: boolean;
}

export default function TabButton({
	selected = false,
	type = "button",
	className,
	children,
	...props
}: TabButtonProps) {
	return (
		<button
			type={type}
			aria-pressed={selected}
			className={cn(
				"w-fit shrink-0 px-4 font-medium transition-colors",
				"h-9 rounded-[0.875rem] text-sm md:h-10 md:rounded-2xl md:text-base",
				"enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
				selected ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800",
				className,
			)}
			{...props}>
			{children}
		</button>
	);
}
