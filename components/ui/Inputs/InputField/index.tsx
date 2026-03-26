import Input from "../Input";
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { InputFieldWrapper } from "../InputFieldWrapper";

interface InputFieldProps extends ComponentProps<typeof Input> {
	label?: string;
	isRequired?: boolean;
	hintText?: string;
	inputClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
	{
		label,
		isRequired = false,
		hintText,
		isDestructive = false,
		className,
		inputClassName,
		...props
	},
	ref,
) {
	return (
		<InputFieldWrapper
			label={label}
			isRequired={isRequired}
			hintText={hintText}
			isDestructive={isDestructive}
			className={className}>
			{({ id, descriptionId }) => (
				<Input
					ref={ref}
					id={id}
					aria-describedby={hintText ? descriptionId : undefined}
					isDestructive={isDestructive}
					className={inputClassName}
					{...props}
				/>
			)}
		</InputFieldWrapper>
	);
});

export default InputField;
