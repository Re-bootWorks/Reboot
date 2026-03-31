"use client";

import { cn } from "@/utils/cn";

interface PageTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 아이콘 */
	icon?: React.ReactNode;
	/** 텍스트 또는 컴포넌트 라벨 */
	children: React.ReactNode;
	/** 활성화 여부 */
	isActive?: boolean;
	/** 테두리 여부 */
	hasBorder?: boolean;
}

export default function PageTab({
	icon,
	children,
	isActive = false,
	hasBorder = true,
	...props
}: PageTabProps) {
	return (
		<button
			className={cn(
				"flex min-w-28 cursor-pointer items-center justify-center gap-x-2 py-2 text-sm font-semibold transition-[color,border-color] duration-200 md:min-w-40 md:px-4 md:py-4 md:text-xl",
				isActive ? "border-purple-600 text-purple-600" : "border-gray-200 text-gray-600",
				hasBorder && "border-b-2",
			)}
			role="tab"
			aria-selected={isActive}
			type="button"
			{...props}>
			{icon}
			<div className="whitespace-nowrap">{children}</div>
		</button>
	);
}
