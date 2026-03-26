"use client";

import InputField from "@/components/ui/Inputs/InputField";

interface CapacityFieldProps {
	/** 필드 이름 @default "capacity" */
	name: string;
	/** 필드 값 */
	value?: number;
	/** 필드 값 변경 함수 */
	onChange: (value: number, e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 추가 클래스명 */
	className?: string;
	/** 필수 필드 여부 @default true */
	isRequired?: boolean;
}
export default function CapacityField({
	name = "capacity",
	value,
	onChange,
	className,
	isRequired = true,
}: CapacityFieldProps) {
	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(Number(e.target.value), e);
	}

	return (
		<InputField
			name={name}
			label="모임 정원"
			placeholder="숫자만 입력해주세요"
			type="number"
			className={className}
			isRequired={isRequired}
			value={!value || value <= 0 ? "" : value}
			onChange={handleChangeInput}
		/>
	);
}
