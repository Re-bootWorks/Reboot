import { cn } from "@/utils/cn";
import { IcAlarm } from "@/components/ui/icons";

type DeadlineTagSize = "sm" | "md";

interface DeadlineTagProps {
	children: React.ReactNode;
	size?: DeadlineTagSize;
	iconSize?: "sm" | "md";
	className?: string;
}

const sizeVariants: Record<DeadlineTagSize, string> = {
	sm: "h-5 rounded-md text-xs",
	md: "h-6 rounded-lg text-sm",
};

const iconSizeMap: Record<DeadlineTagSize, "sm" | "md"> = {
	sm: "sm",
	md: "md",
};

export function DeadlineTag({ children, size = "sm", iconSize, className }: DeadlineTagProps) {
	const finalIconSize = iconSize || iconSizeMap[size];

	return (
		<div
			className={cn(
				"inline-flex shrink-0 items-center gap-1 bg-orange-100 pr-2 pl-1 font-semibold whitespace-nowrap text-orange-500",
				sizeVariants[size],
				className,
			)}>
			<IcAlarm color="orange-500" size={finalIconSize} />
			{children}
		</div>
	);
}
