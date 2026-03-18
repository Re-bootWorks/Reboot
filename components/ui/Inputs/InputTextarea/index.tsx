import { cn } from "@/utils/cn";

interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/** 라벨명 */
	label: string;
	/** 식별 ID */
	id: string;
	/** 데이터 필드명 */
	name: string;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 설명 */
	description?: React.ReactNode;
	/** 필수 작성 여부 */
	required?: boolean;
	/** 리사이즈 가능 여부 */
	isResizeable?: boolean;
	/** 기본 값 */
	defaultValue?: string;
}

export default function InputTextarea({
	label,
	id,
	name,
	placeholder,
	description,
	defaultValue,
	required = false,
	isResizeable = false,
	...props
}: InputTextareaProps) {
	return (
		<label htmlFor={id} className="flex w-full flex-col">
			<div className="mb-1 flex items-center px-1">
				<span className="text-gray-800">{label}</span>
				<span className="px-0.5 leading-5 font-bold text-purple-500">{required ? "*" : ""}</span>
			</div>
			<textarea
				{...props}
				id={id}
				name={name}
				required={required}
				placeholder={placeholder}
				defaultValue={defaultValue}
				className={cn(
					"min-h-[120px] w-full rounded-xl bg-gray-50 p-3 outline-none placeholder:text-gray-500",
					isResizeable ? "resize-y" : "resize-none",
				)}
			/>
			{description && <p className="mt-1.5 w-full px-1 text-sm text-gray-500">{description}</p>}
		</label>
	);
}
