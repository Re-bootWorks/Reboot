import { useId } from "react";
import { Field, Label, Description } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface InputFieldWrapperProps {
	/** 라벨명 */
	label?: string;
	/** 필수 작성 여부 */
	isRequired?: boolean;
	/** 입력 필드 하단에 표시되는 힌트 또는 에러 메시지 */
	hintText?: string;
	/** 에러 상태 여부 */
	isDestructive?: boolean;
	/** 추가 클래스명 */
	className?: string;
	/** 자식 컴포넌트 렌더링 함수 */
	children: (props: { id: string; descriptionId: string }) => React.ReactNode;
}

export function InputFieldWrapper({
	label,
	isRequired = false,
	hintText,
	isDestructive = false,
	className,
	children,
}: InputFieldWrapperProps) {
	const id = useId();
	const descriptionId = useId();

	return (
		<Field className={cn("flex w-full flex-col items-start gap-1.5", className)}>
			{label && (
				<Label htmlFor={id} className="px-1 text-sm font-medium text-gray-800">
					{label}
					{isRequired && <span className="text-sm font-medium text-purple-500">*</span>}
				</Label>
			)}
			{children({ id, descriptionId })}
			{hintText && (
				<Description
					id={descriptionId}
					className={cn(
						"px-1 text-xs font-medium text-gray-500 md:text-sm",
						isDestructive ? "text-error" : "",
					)}>
					{hintText}
				</Description>
			)}
		</Field>
	);
}
