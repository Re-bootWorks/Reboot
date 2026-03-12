"use client";

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { useState } from "react";

type FilterDropdownProps = {
	label: string;
	options: string[];
	onChange?: (value: string) => void;
};

export function FilterDropdown({ label, options, onChange }: FilterDropdownProps) {
	const [selected, setSelected] = useState(label);

	const handleChange = (value: string) => {
		setSelected(value);
		onChange?.(value);
	};

	const isActive = selected !== label;

	return (
		<Listbox value={selected} onChange={handleChange}>
			<div className="relative inline-block">
				<ListboxButton
					className={`flex items-center gap-1 transition-colors ${
						isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
					}`}>
					{selected}
					<span>▼</span>
				</ListboxButton>

				<ListboxOptions className="absolute left-0 mt-2 w-40 rounded-md border bg-white shadow">
					{options.map((option) => (
						<ListboxOption
							key={option}
							value={option}
							className="cursor-pointer px-4 py-2 hover:bg-gray-100">
							{option}
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
}
