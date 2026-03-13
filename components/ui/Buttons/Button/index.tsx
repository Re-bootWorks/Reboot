import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import LoaderDots from "../../LoaderDots";

const buttonVariants = cva(
	"flex justify-center items-center w-full text-center whitespace-nowrap cursor-pointer",
	{
		variants: {
			sizes: {
				small: "h-10 rounded-[0.625rem] px-4 text-sm font-semibold", // 40px
				smallMedium: "h-11 rounded-[0.625rem] px-4 text-base font-semibold", // 44px
				medium: "h-12 rounded-xl px-6 text-base font-semibold", // 48px
				mediumLarge: "h-14 rounded-2xl px-[1.875rem] text-xl font-semibold", // 56px
				large: "h-[3.75rem] rounded-2xl px-[1.875rem] text-xl font-semibold", // 60px
			},
			colors: {
				purple: "bg-purple-500 text-white hover:bg-purple-600 hover:text-purple-200",
				purpleBorder: "bg-white border border-purple-500 text-purple-600 hover:text-purple-700",
				grayBorder: "bg-white border border-gray-200 text-gray-600",
			},
		},
		defaultVariants: {
			sizes: "medium",
			colors: "purple",
		},
	},
);

export type ButtonSizes = VariantProps<typeof buttonVariants>["sizes"];
export type ButtonColors = VariantProps<typeof buttonVariants>["colors"];

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	children: ReactNode;
	isPending?: boolean;
	disabled?: boolean;
}

const LOADER_SIZE_MAP: Record<NonNullable<ButtonSizes>, "sm" | "md" | "lg"> = {
	small: "sm",
	smallMedium: "sm",
	medium: "md",
	mediumLarge: "md",
	large: "lg",
};

export default function Button({
	children,
	sizes = "medium",
	colors = "purple",
	className,
	isPending = false,
	disabled = false,
	type,
	...props
}: ButtonProps) {
	const disabledButtonClass =
		"disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-0";
	const loaderSize = LOADER_SIZE_MAP[sizes as NonNullable<ButtonSizes>];

	return (
		<button
			type={type ?? "button"}
			className={cn(buttonVariants({ sizes, colors }), disabledButtonClass, className)}
			disabled={isPending || disabled}
			aria-busy={isPending}
			{...props}>
			{isPending ? (
				<>
					<LoaderDots size={loaderSize} className="fill-gray-600" />
					<span className="sr-only">요청 처리 중</span>
				</>
			) : (
				children
			)}
		</button>
	);
}
