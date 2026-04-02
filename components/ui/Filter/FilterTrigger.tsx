import Button from "@/components/ui/Buttons/Button";
import { cn } from "@/utils/cn";

interface FilterTriggerProps {
	children: React.ReactNode;
	isActive?: boolean;
	onClick?: () => void;
	className?: string;
}

export default function FilterTrigger({
	children,
	isActive = false,
	onClick,
	className,
}: FilterTriggerProps) {
	return (
		<Button
			onClick={onClick}
			colors="grayBorder"
			className={cn(
				//  Button 덮어쓰기
				"h-6 w-auto px-0 md:h-8",
				"rounded-lg",

				// 폰트
				"!text-sm leading-5 !font-medium tracking-[-0.32px] md:!text-base md:leading-6",

				// 상태
				isActive ? "border-gray-300 text-gray-800" : "border-gray-200 text-gray-600",

				// layout
				"flex items-center gap-1 whitespace-nowrap",

				"border-none shadow-none",
				"bg-transparent",

				className,
			)}>
			{children}
		</Button>
	);
}
