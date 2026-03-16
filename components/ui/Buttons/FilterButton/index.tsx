import { cn } from "@/utils/cn";
import IcFilter from "@/components/ui/icons/IcFilter";

type FilterButtonProps = {
	label: string;
	isActive?: boolean;
	onClick?: () => void;
};

export function FilterButton({ label, isActive = false, onClick }: FilterButtonProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex h-[2rem] items-center gap-[0.25rem] rounded-[0.5rem] px-[0.75rem] text-sm font-semibold transition-colors",
				isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900",
			)}>
			<IcFilter color={isActive ? "gray-900" : "gray-600"} size="xs" />
			<span>{label}</span>
		</button>
	);
}

export default FilterButton;
