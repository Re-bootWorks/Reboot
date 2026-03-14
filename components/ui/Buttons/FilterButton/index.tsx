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
				"flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
				isActive ? "text-gray-900 hover:text-gray-600" : "text-gray-600 hover:text-gray-900",
			)}>
			<IcFilter color={isActive ? "gray-900" : "gray-600"} size="xs" />
			<span>{label}</span>
		</button>
	);
}

export default FilterButton;
