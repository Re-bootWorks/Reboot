import { cn } from "@/utils/cn";
import { IcChevronDown } from "@/components/ui/icons";

interface ExpandToggleButtonProps {
	isExpanded: boolean;
	onClick: () => void;
	className?: string;
}

export default function ExpandToggleButton({
	isExpanded,
	onClick,
	className,
}: ExpandToggleButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex cursor-pointer items-center gap-0.5 text-sm font-medium text-gray-700 underline underline-offset-3 select-none md:mb-2 md:text-lg",
				className,
			)}>
			{isExpanded ? "접기" : "더보기"}
			<IcChevronDown color="gray-700" className={cn(isExpanded && "rotate-180")} />
		</button>
	);
}
