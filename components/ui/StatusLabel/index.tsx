import { cn } from "@/utils/cn";
import { IcCheckCircle } from "@/components/ui/icons";

type StatusLabelSize = "sm" | "md";

interface StatusLabelProps {
	children: React.ReactNode;
	size?: StatusLabelSize;
	iconSize?: "xs" | "sm";
	className?: string;
}

const sizeVariants: Record<StatusLabelSize, string> = {
	sm: "h-4.5 text-xs",
	md: "h-6 text-sm",
};

const iconSizeMap: Record<StatusLabelSize, "xs" | "sm"> = {
	sm: "xs",
	md: "sm",
};

export function StatusLabel({ children, size = "sm", iconSize, className }: StatusLabelProps) {
	const finalIconSize = iconSize || iconSizeMap[size];

	return (
		<div
			className={cn(
				"inline-flex shrink-0 items-center gap-0.5 font-medium whitespace-nowrap text-purple-600",
				sizeVariants[size],
				className,
			)}>
			<IcCheckCircle size={finalIconSize} />
			{children}
		</div>
	);
}
