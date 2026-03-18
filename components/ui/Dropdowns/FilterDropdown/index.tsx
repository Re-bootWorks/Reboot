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
			<MenuButton className="flex items-center gap-1 text-sm font-semibold text-gray-800">
				<IcFilter size="sm" className="text-gray-500" />
				{value}
			</MenuButton>

			<MenuItems
				anchor="bottom start"
				className={cn(
					"mt-2 w-[126px]",
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
										"h-[32px] w-full",
										"flex items-center",
										"rounded-lg",
										"text-[14px] leading-[20px] font-semibold tracking-[-0.42px]",
										"transition",
										"px-2",
										{
											"bg-[#BEBAF4] text-purple-600": selected,
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
