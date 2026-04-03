"use client";

import { InputFieldWrapper } from "@/components/ui/Inputs/InputFieldWrapper";
import SelectDropdown from "@/components/ui/Dropdowns/SelectDropdown";
import { useCategoryStore } from "@/store/category.store";

interface TypeSelectFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export default function TypeSelectField({ value, onChange }: TypeSelectFieldProps) {
	const categories = useCategoryStore((state) => state.categories);

	const categoryOptions = categories.map((category) => category.name);
	return (
		<InputFieldWrapper label="모임 종류">
			{({ id }) => (
				<SelectDropdown
					triggerLabel="모임 종류를 선택해 주세요"
					options={categoryOptions}
					value={value}
					onChange={onChange}
					aria-labelledby={id}
				/>
			)}
		</InputFieldWrapper>
	);
}
