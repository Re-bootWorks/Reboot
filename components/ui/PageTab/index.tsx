"use client";

import { cn } from "@/utils/cn";

interface PageTabProps {
	icon?: React.ReactNode;
	children: React.ReactNode;
	isActive?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const PAGE_TAB_DEFAULT_STYLE =
	"flex min-w-[113.669px] cursor-pointer items-center justify-center gap-x-2 px-8 py-2 text-sm md:min-w-[159px] md:px-4 md:py-4 md:text-xl";
export default function PageTab({ icon, children, isActive = true, onClick }: PageTabProps) {
	return (
		<button
			className={cn(
				PAGE_TAB_DEFAULT_STYLE,
				"border-b-2",
				isActive ? "border-purple-600 text-purple-600" : "border-gray-200 text-gray-600",
			)}
			onClick={onClick}>
			{icon}
			<div className="whitespace-nowrap">{children}</div>
		</button>
	);
}
