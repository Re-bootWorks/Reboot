import { cn } from "@/utils/cn";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { useMemo, useState, type ButtonHTMLAttributes } from "react";
import { IcArrowDown } from "../../icons";

const buttonVariants = cva(
	[
		"relative flex h-10 md:h-12 w-full items-center justify-between border border-gray-50 rounded-[0.625rem] bg-gray-50 px-3 text-left",
		"text-sm md:text-base font-normal text-gray-800",
		"transition-colors",
		"focus:outline-none",
		"disabled:cursor-not-allowed disabled:text-gray-400",
	].join(" "),
	{
		variants: {
			open: {
				true: "border-purple-500",
			},
		},
		defaultVariants: {
			open: false,
		},
	},
);

const optionsVariants = cva(
	[
		"absolute left-0 top-full z-20 mt-2 w-full max-h-55 overflow-y-auto scrollbar-hide rounded-xl border border-gray-200 bg-white",
		"shadow-[0_0_50px_0_rgba(0,0,0,0.08)]",
		"outline-none",
		"data-[closed]:scale-95 data-[closed]:opacity-0",
		"origin-top transition duration-150 ease-out",
	].join(" "),
);

const optionVariants = cva(
	[
		"flex w-full h-9.5 items-center px-4 text-left text-sm md:text-base font-medium text-gray-800",
		"cursor-pointer transition-colors",
		"focus:outline-none",
		"data-[focus]:bg-gray-50",
		"disabled:cursor-not-allowed disabled:text-gray-300",
	].join(" "),
	{
		variants: {
			selected: {
				true: "bg-gray-50",
				false: "",
			},
		},
		defaultVariants: {
			selected: false,
		},
	},
);

export type RegionDropdownOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

interface RegionDropdownProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children" | "value" | "defaultValue" | "onChange"
> {
	options: RegionDropdownOption[];
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	buttonClassName?: string;
	optionsClassName?: string;
	optionClassName?: string;
	onChange?: (value: string) => void;
}

export default function RegionDropdown({
	options,
	value,
	defaultValue,
	placeholder = "선택해 주세요",
	className,
	buttonClassName,
	optionsClassName,
	optionClassName,
	onChange,
	disabled,
	type,
	...props
}: RegionDropdownProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue ?? "");

	const selectedValue = isControlled ? value : internalValue;
	const selectedOption = useMemo(
		() => options.find((option) => option.value === selectedValue),
		[options, selectedValue],
	);

	const handleChange = (nextValue: string) => {
		if (!isControlled) {
			setInternalValue(nextValue);
		}

		onChange?.(nextValue);
	};

	return (
		<Listbox value={selectedValue} onChange={handleChange} disabled={disabled}>
			{({ open }) => (
				<div className={cn("relative w-full", className)}>
					<ListboxButton
						type={type ?? "button"}
						className={cn(buttonVariants({ open }), buttonClassName)}
						{...props}>
						<span className="truncate">{selectedOption?.label ?? placeholder}</span>
						<IcArrowDown
							className={cn(
								"size-4.5 shrink-0 transition-transform duration-200 md:size-6",
								open && "rotate-180",
							)}
						/>
					</ListboxButton>

					<ListboxOptions transition className={cn(optionsVariants(), optionsClassName)}>
						{options.map((option) => (
							<ListboxOption
								key={option.value}
								value={option.value}
								disabled={option.disabled}
								className={({ selected }) => cn(optionVariants({ selected }), optionClassName)}>
								{option.label}
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			)}
		</Listbox>
	);
}
