"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { cn } from "@/utils/cn";
import IcFilter from "@/components/ui/icons/IcFilter";

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
	return (
		<Menu as="div" className="relative inline-block">
			<MenuButton
				type="button"
				className="flex items-center gap-2 text-sm font-semibold text-gray-800">
				<IcFilter size="sm" className="text-gray-500" />
				{value}
			</MenuButton>
			<MenuItems
				anchor="bottom start"
				className={cn(
					"mt-[0.5rem] w-[10rem]",
					"rounded-[1rem] border border-gray-200 bg-white",
					"shadow-[0_0.5rem_1.25rem_rgba(0,0,0,0.06)]",
					"p-[0.5rem]",
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
										"w-full rounded-[0.75rem] px-[0.75rem] py-[0.5rem] text-left text-sm transition",
										{
											"bg-purple-200 font-semibold text-purple-700": selected,
											"bg-gray-50": !selected && active,
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
