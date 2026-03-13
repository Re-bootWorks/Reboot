import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

const inputVariants = cva(
	"flex w-full items-center gap-2.5 rounded-[10px] bg-gray-50 px-3 py-2.5 text-sm font-normal transition-colors md:rounded-[12px] md:py-3 md:text-base",
	{
		variants: {
			isDestructive: {
				true: "border border-error",
				false: "border border-transparent focus-within:border-purple-500",
			},
		},
		defaultVariants: {
			isDestructive: false,
		},
	},
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	isDestructive?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	onRightIconClick?: () => void;
	className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ isDestructive = false, leftIcon, rightIcon, onRightIconClick, className, disabled, ...props },
	ref,
) {
	return (
		<div
			className={cn(
				inputVariants({ isDestructive }),
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}>
			{leftIcon}
			<input
				ref={ref}
				className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed"
				disabled={disabled}
				{...props}
			/>
			{rightIcon &&
				(onRightIconClick ? (
					<button
						type="button"
						className="cursor-pointer"
						disabled={disabled}
						onClick={onRightIconClick}>
						{rightIcon}
					</button>
				) : (
					rightIcon
				))}
		</div>
	);
});

export default Input;
