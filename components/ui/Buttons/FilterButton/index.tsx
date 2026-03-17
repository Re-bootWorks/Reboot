import { cn } from "@/utils/cn";
import IcFilter from "@/components/ui/icons/IcFilter";

type FilterButtonProps = {
	label: string;
	isActive?: boolean;
	onClick?: () => void;
	className?: string;
};

export function FilterButton({ label, isActive, onClick, className }: FilterButtonProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-semibold transition-colors",
				className,
			)}>
			<IcFilter color="currentColor" className="h-4 w-4" />
			<span>{label}</span>
		</button>
	);
}

export default FilterButton;
