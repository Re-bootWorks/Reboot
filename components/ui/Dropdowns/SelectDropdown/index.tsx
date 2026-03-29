import { cn } from "@/utils/cn";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { IcArrowDown } from "../../icons";
import Input from "../../Inputs/Input";

const optionsVariants = cva(
	[
		"absolute left-0 top-full z-20 mt-2 max-h-55 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white scrollbar-hide",
		"shadow-xl outline-none",
		"origin-top transition duration-150 ease-out",
		"data-[closed]:scale-95 data-[closed]:opacity-0",
	].join(" "),
);

const optionContentVariants = cva(
	"flex h-9 select-none items-center rounded-lg px-3 text-left text-sm font-medium transition-colors md:text-base",
	{
		variants: {
			selected: {
				true: "bg-purple-200 font-bold text-purple-600",
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

interface SelectDropdownProps {
	/** 선택 전 트리거 버튼에 표시할 기본 문구 */
	triggerLabel: string;
	/** 드롭다운에 표시할 옵션 목록 */
	options: string[];
	/** 선택된 옵션 값 */
	value?: string;
	/** 초기 선택 옵션 값 */
	defaultValue?: string;
	/** 값이 없을 때 표시할 문구 */
	placeholder?: string;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 최상위 래퍼 클래스명 */
	className?: string;
	/** 입력창(Input) 클래스명 */
	inputClassName?: string;
	/** 옵션 목록(ListboxOptions) 클래스명 */
	optionsClassName?: string;
	/** 개별 옵션 클래스명 */
	optionClassName?: string;
	/** 값 변경 콜백 */
	onChange?: (value: string) => void;
}

const normalizeText = (value?: string) => value?.trim() ?? "";

export default function SelectDropdown({
	triggerLabel,
	options,
	value,
	defaultValue,
	placeholder = "선택해 주세요",
	disabled = false,
	className,
	inputClassName,
	optionsClassName,
	optionClassName,
	onChange,
}: SelectDropdownProps) {
	const normalizedTriggerLabel = normalizeText(triggerLabel);

	const normalizedOptions = useMemo(
		() => options.map((option) => normalizeText(option)).filter(Boolean),
		[options],
	);

	const isControlled = value !== undefined;

	const [internalValue, setInternalValue] = useState(() => normalizeText(defaultValue));

	const selectedValue = isControlled ? normalizeText(value) : internalValue;

	const triggerDisplayValue = selectedValue || normalizedTriggerLabel;

	const handleChange = (nextValue: string) => {
		const normalizedValue = normalizeText(nextValue);

		if (!isControlled) {
			setInternalValue(normalizedValue);
		}

		onChange?.(normalizedValue);
	};

	return (
		<Listbox value={selectedValue} onChange={handleChange} disabled={disabled}>
			{({ open }) => (
				<div className={cn("relative w-full", className)}>
					<div className="relative">
						<Input
							readOnly
							tabIndex={-1}
							disabled={disabled}
							value={triggerDisplayValue}
							placeholder={placeholder}
							rightIcon={
								<IcArrowDown
									className={cn(
										"size-4.5 shrink-0 transition-transform duration-200 md:size-6",
										open && "rotate-180",
									)}
								/>
							}
							className={cn(
								"pointer-events-none",
								open && "border border-purple-500",
								inputClassName,
							)}
						/>

						<ListboxButton
							className="absolute inset-0 z-10 cursor-pointer rounded-[10px] md:rounded-[12px]"
							aria-label={triggerDisplayValue || placeholder}
						/>
					</div>

					<ListboxOptions transition className={cn(optionsVariants(), optionsClassName)}>
						{normalizedOptions.map((option, index) => (
							<ListboxOption
								key={`${option}-${index}`}
								value={option}
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
										{option}
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
