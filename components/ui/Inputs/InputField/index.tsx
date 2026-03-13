import { Field, Label, Description } from "@headlessui/react";
import { cn } from "@/utils/cn";
import Input from "../Input";
import { forwardRef, useId } from "react";
import type { ComponentProps } from "react";

interface InputFieldProps extends ComponentProps<typeof Input> {
	label?: string;
	isRequired?: boolean;
	hintText?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
	{ label, isRequired = false, hintText, isDestructive = false, className, ...props },
	ref,
) {
	const id = useId();
	const descriptionId = useId();

	return (
		<Field className={cn("flex w-full flex-col items-start gap-[0.375rem]", className)}>
			{label && (
				<Label htmlFor={id} className="px-1 text-sm font-medium text-gray-800">
					{label}
					{isRequired && <span className="text-sm font-medium text-purple-500">*</span>}
				</Label>
			)}
			<Input
				ref={ref}
				id={id}
				aria-describedby={hintText ? descriptionId : undefined}
				isDestructive={isDestructive}
				{...props}
			/>
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
});

export default InputField;
