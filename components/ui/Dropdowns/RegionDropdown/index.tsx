import { cn } from "@/utils/cn";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { useMemo, useState, type ButtonHTMLAttributes } from "react";
import { IcArrowDown } from "../../icons";

const buttonVariants = cva(
	[
		"relative flex h-10 w-full cursor-pointer items-center justify-between rounded-[0.625rem] border border-gray-50 bg-gray-50 px-3 text-left md:h-12 md:rounded-xl",
		"text-sm font-normal text-gray-800 md:text-base",
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
		"absolute left-0 top-full z-20 mt-2 max-h-55 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white scrollbar-hide",
		"shadow-xl",
		"outline-none",
		"data-[closed]:scale-95 data-[closed]:opacity-0",
		"origin-top transition duration-150 ease-out",
	].join(" "),
);

const optionContentVariants = cva(
	[
		"select-none flex h-9 md:h-9 items-center rounded-lg px-3 text-left text-sm font-medium transition-colors md:text-base",
	].join(" "),
	{
		variants: {
			selected: {
				true: "bg-purple-200 text-purple-600 font-bold",
				false: "text-gray-800",
			},
			focus: {
				true: "bg-gray-50",
				false: "",
			},
			disabled: {
				true: "cursor-not-allowed text-gray-300",
				false: "",
			},
		},
		compoundVariants: [
			{
				selected: true,
				focus: true,
				className: "bg-purple-200 text-purple-600",
			},
		],
		defaultVariants: {
			selected: false,
			focus: false,
			disabled: false,
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
								className="cursor-pointer p-1 outline-none">
								{({ selected, focus, disabled }) => (
									<div
										className={cn(
											optionContentVariants({
												selected,
												focus: !selected && focus,
												disabled,
											}),
											optionClassName,
										)}>
										{option.label}
									</div>
								)}
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			)}
		</Listbox>
	);
}
