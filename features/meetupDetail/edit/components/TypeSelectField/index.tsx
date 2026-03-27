"use client";

import { InputFieldWrapper } from "@/components/ui/Inputs/InputFieldWrapper";
import { MEETUP_TYPES } from "@/features/meetup/list/constants";
import SelectDropdown from "@/components/ui/Dropdowns/SelectDropdown";

interface TypeSelectFieldProps {
	value: string;
	onChange: (value: string) => void;
}

const MEETUP_TYPE_OPTIONS = MEETUP_TYPES.filter((type) => type.value !== "all").map(
	(type) => type.label,
);

export default function TypeSelectField({ value, onChange }: TypeSelectFieldProps) {
	return (
		<InputFieldWrapper label="모임 종류">
			{({ id }) => (
				<SelectDropdown
					triggerLabel="모임 종류를 선택해 주세요"
					options={MEETUP_TYPE_OPTIONS}
					value={value}
					onChange={onChange}
					aria-labelledby={id}
				/>
			)}
		</InputFieldWrapper>
	);
}
