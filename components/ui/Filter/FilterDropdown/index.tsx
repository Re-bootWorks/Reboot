"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { cn } from "@/utils/cn";
import IcFilter from "@/components/ui/icons/IcFilter";
import FilterTrigger from "@/components/ui/Filter/FilterTrigger";

type SortDropdownItem = {
	label: string;
	value: string;
};

type FilterDropdownProps = {
	value: string;
	items: SortDropdownItem[];
	onChange: (value: string) => void;
};

export function FilterDropdown({ value, items, onChange }: FilterDropdownProps) {
	const selectedItem = items.find((item) => item.value === value);

	return (
		<Menu as="div" className="relative inline-block">
			<MenuButton as="div">
				<FilterTrigger isActive={!!value}>
					<IcFilter className="h-4 w-4" />
					<span>{selectedItem?.label ?? value}</span>
				</FilterTrigger>
			</MenuButton>

			<MenuItems
				anchor="bottom start"
				className={cn(
					"mt-2 w-32",
					"rounded-lg border border-gray-200 bg-white",
					"shadow-lg",
					"p-1",
					"flex flex-col gap-1",
					"outline-none",
				)}>
				{items.map((item) => {
					const selected = value === item.value;

					return (
						<MenuItem key={item.value}>
							{({ active }) => (
								<button
									type="button"
									onClick={() => onChange(item.value)}
									className={cn(
										"h-8 w-full",
										"flex items-center",
										"rounded-lg",
										"text-sm font-semibold",
										"transition",
										"px-2",
										{
											"bg-purple-200 text-purple-600": selected,
											"bg-gray-50 text-gray-900": !selected && active,
											"text-gray-900": !selected,
										},
									)}>
									{item.label}
								</button>
							)}
						</MenuItem>
					);
				})}
			</MenuItems>
		</Menu>
	);
}
