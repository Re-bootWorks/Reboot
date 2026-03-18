import { cn } from "@/utils/cn";

type TimeTagSize = "sm" | "md";

interface TimeTagProps {
	children: React.ReactNode;
	size?: TimeTagSize;
	className?: string;
}

const sizeVariants: Record<TimeTagSize, string> = {
	sm: "h-5 rounded-md text-xs",
	md: "h-6 rounded-lg text-sm",
};

export function TimeTag({ children, size = "sm", className }: TimeTagProps) {
	return (
		<div
			className={cn(
				"inline-flex shrink-0 items-center border border-gray-200 bg-white px-2 py-0.5 font-medium whitespace-nowrap text-gray-600",
				sizeVariants[size],
				className,
			)}>
			{children}
		</div>
	);
}
