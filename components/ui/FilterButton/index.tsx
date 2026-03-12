type FilterButtonProps = {
	label: string;
	isActive?: boolean;
	onClick?: () => void;
};

export function FilterButton({ label, isActive = false, onClick }: FilterButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
				isActive ? "text-gray-900 hover:text-gray-600" : "text-gray-600 hover:text-gray-900"
			} `}>
			<svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
				<rect x="3" y="5" width="18" height="2" rx="1" />
				<rect x="6" y="11" width="12" height="2" rx="1" />
				<rect x="9" y="17" width="6" height="2" rx="1" />
			</svg>

			<span>{label}</span>
		</button>
	);
}
