"use client";

import InputField from "@/components/ui/Inputs/InputField";
import { MAX_NAME_LENGTH } from "@/features/meetup/utils";

interface NameFieldProps {
	/** 필드 이름 @default "name" */
	name?: string;
	/** 필드 값 */
	value?: string;
	/** 필드 값 변경 함수 */
	onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 추가 클래스명 */
	className?: string;
	/** 필수 필드 여부 @default true */
	isRequired?: boolean;
}
export default function NameField({
	name = "name",
	value,
	onChange,
	className,
	isRequired = true,
}: NameFieldProps) {
	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value, e);
	}
	return (
		<InputField
			name={name}
			label="모임 이름"
			placeholder="모임 이름을 입력해 주세요"
			className={className}
			isRequired={isRequired}
			value={value}
			maxLength={MAX_NAME_LENGTH}
			onChange={handleChangeInput}
		/>
	);
}
