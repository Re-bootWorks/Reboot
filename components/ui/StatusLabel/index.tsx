import { cn } from "@/utils/cn";
import { IcCheckCircle } from "@/components/ui/icons";

interface StatusLabelProps {
	children: React.ReactNode;
	className?: string;
}

export function StatusLabel({ children, className }: StatusLabelProps) {
	return (
		<div
			className={cn(
				"inline-flex h-[18px] shrink-0 items-center gap-0.5 text-xs font-medium whitespace-nowrap text-purple-600 md:h-6 md:text-sm",
				className,
			)}>
			<IcCheckCircle size="xs" className="md:h-6 md:w-6" />
			{children}
		</div>
	);
}
