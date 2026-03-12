import { cn } from "@/utils/cn";
import { IcAlarm } from "@/components/ui/icons";

interface DeadlineTagProps {
	children: React.ReactNode;
	className?: string;
}

export function DeadlineTag({ children, className }: DeadlineTagProps) {
	return (
		<div
			className={cn(
				"inline-flex h-5 shrink-0 items-center gap-1 rounded-md bg-orange-100 pr-2 pl-1 text-xs font-semibold whitespace-nowrap text-orange-500 md:h-6 md:rounded-lg md:text-sm",
				className,
			)}>
			<IcAlarm color="orange-500" size="xs" className="md:h-6 md:w-6" />
			{children}
		</div>
	);
}
