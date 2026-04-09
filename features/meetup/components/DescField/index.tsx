"use client";

import InputTextarea from "@/components/ui/Inputs/InputTextarea";

interface DescFieldProps {
	/** 필드 이름 @default "description" */
	name?: string;
	/** 필드 값 */
	value?: string;
	/** 필드 값 변경 함수 */
	onChange: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	/** 추가 클래스명 */
	className?: string;
	/** 필수 필드 여부 @default true */
	isRequired?: boolean;
}
export default function DescField({
	name = "description",
	value,
	onChange,
	className,
	isRequired = true,
}: DescFieldProps) {
	function handleChangeInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
		onChange(e.target.value, e);
	}

	return (
		<InputTextarea
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
