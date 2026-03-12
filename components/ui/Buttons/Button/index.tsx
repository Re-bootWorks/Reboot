import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const DISABLED_BUTTON_CLASS =
	"disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed";

const buttonVariants = cva("w-full text-center whitespace-nowrap cursor-pointer", {
	variants: {
		sizes: {
			small: "h-10 rounded-[0.625rem] px-4 text-sm font-semibold", // 40px
			smallMedium: "h-11 rounded-[0.625rem] px-4 text-base font-semibold", // 44px
			medium: "h-12 rounded-xl px-6 text-base font-semibold", // 48px
			mediumLarge: "h-14 rounded-2xl px-[1.875rem] text-xl font-semibold", // 56px
			large: "h-[3.75rem] rounded-2xl px-[1.875rem] text-xl font-semibold", // 60px
		},
		colors: {
			purple: `bg-purple-500 text-white hover:bg-purple-600 hover:text-purple-200 ${DISABLED_BUTTON_CLASS}`,
			purpleBorder: `bg-white border border-purple-500 text-purple-600 hover:text-purple-700 ${DISABLED_BUTTON_CLASS} disabled:border-0`,
			grayBorder: "bg-white border border-gray-200 text-gray-600",
		},
	},
	defaultVariants: {
		sizes: "medium",
		colors: "purple",
	},
});

export type ButtonSizes = VariantProps<typeof buttonVariants>["sizes"];
export type ButtonColors = VariantProps<typeof buttonVariants>["colors"];

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	children: ReactNode;
	isPending?: boolean;
	disabled?: boolean;
}

export default function Button({
	children,
	sizes = "medium",
	colors = "purple",
	className,
	isPending = false,
	disabled = false,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ sizes, colors }), className)}
			disabled={isPending || disabled}
			{...props}>
			{/* {isPending ? <Spinner /> : <>{children}</>} */}
			{children}
		</button>
	);
}
