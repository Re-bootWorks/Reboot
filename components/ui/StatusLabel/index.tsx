import { cn } from "@/utils/cn";

interface StatusLabelProps {
	children: React.ReactNode;
	className?: string;
}

export function StatusLabel({ children, className }: StatusLabelProps) {
	return (
		<div
			className={cn(
				"inline-flex h-[18px] items-center gap-0.5 text-xs font-medium text-purple-600 md:h-6 md:text-sm",
				className,
			)}>
			{children}
		</div>
	);
}
