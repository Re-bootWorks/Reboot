import { cn } from "@/utils/cn";
import { InputFieldWrapper } from "../InputFieldWrapper";

interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/** 데이터 필드명 */
	name: string;
	/** 라벨명 */
	label?: string;
	/** 필수 작성 여부 */
	isRequired?: boolean;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 입력 필드 하단에 표시되는 힌트 또는 에러 메시지 */
	hintText?: string;
	/** 에러 상태 여부 */
	isDestructive?: boolean;
	/** 리사이즈 가능 여부 */
	isResizeable?: boolean;
	/** 기본 값 */
	defaultValue?: string;
}

export default function InputTextarea({
	label,
	name,
	isRequired = false,
	hintText,
	isDestructive = false,
	placeholder,
	defaultValue,
	isResizeable = false,
	...props
}: InputTextareaProps) {
	return (
		<InputFieldWrapper
			label={label}
			isRequired={isRequired}
			hintText={hintText}
			isDestructive={isDestructive}>
			{({ id, descriptionId }) => (
				<textarea
					id={id}
					name={name}
					required={isRequired}
					placeholder={placeholder}
					defaultValue={defaultValue}
					className={cn(
						"min-h-[120px] w-full rounded-xl bg-gray-50 p-3 transition-colors outline-none placeholder:text-gray-500",
						isResizeable ? "resize-y" : "resize-none",
						!isDestructive
							? "border border-transparent focus-within:border-purple-500"
							: "border-error border",
					)}
					aria-describedby={hintText ? descriptionId : undefined}
					{...props}
				/>
			)}
		</InputFieldWrapper>
	);
}
