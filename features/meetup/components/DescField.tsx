"use client";

import InputField from "@/components/ui/Inputs/InputField";

interface DescFieldProps {
	/** 필드 이름 @default "description" */
	name?: string;
	/** 필드 값 */
	value?: string;
	/** 필드 값 변경 함수 */
	onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 추가 클래스명 */
	className?: string;
	/** 필수 필드 여부 */
	isRequired: boolean;
}
export default function DescField({
	name = "description",
	value,
	onChange,
	className,
	isRequired,
}: DescFieldProps) {
	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value, e);
	}

	return (
		<InputField
			name={name}
			label="모임 설명"
			placeholder="모임을 설명해주세요"
			className={className}
			isRequired={isRequired}
			value={value}
			onChange={handleChangeInput}
		/>
	);
}
