// components/ui/Filter/FilterTrigger.tsx
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface FilterTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isActive?: boolean;
}

const FilterTrigger = forwardRef<HTMLButtonElement, FilterTriggerProps>(function FilterTrigger(
	{ children, isActive = false, className, ...props },
	ref,
) {
	return (
		<button
			ref={ref}
			type="button"
			className={cn(
				// 사이즈
				"h-6 w-auto px-0 md:h-8",
				"rounded-lg",

				// 폰트
				"!text-sm leading-5 !font-medium tracking-[-0.32px] md:!text-base md:leading-6",

				// 상태
				isActive ? "border-gray-300 text-gray-800" : "border-gray-200 text-gray-600",

				// 레이아웃
				"flex items-center gap-1 whitespace-nowrap",

				// 리셋
				"border-none bg-transparent shadow-none",

				"outline-none",
				className,
			)}
			{...props}>
			{children}
		</button>
	);
});

export default FilterTrigger;
