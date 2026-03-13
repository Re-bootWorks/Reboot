import { cn } from "@/utils/cn";

interface TimeTagProps {
	children: React.ReactNode;
	className?: string;
}

export function TimeTag({ children, className }: TimeTagProps) {
	return (
		<div
			className={cn(
				"inline-flex h-5 shrink-0 items-center rounded-md border border-gray-200 bg-white px-2 py-0.5 whitespace-nowrap md:h-6 md:rounded-lg",
				className,
			)}>
			<span className="text-xs font-medium text-gray-600 md:text-sm">{children}</span>
		</div>
	);
}
