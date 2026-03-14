import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import LoaderDots from "../../LoaderDots";
import { ButtonProps, ButtonSizes } from "./type";

const DISABLED_BUTTON_CLASS =
	"disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-0";

export const buttonVariants = cva(
	"flex justify-center items-center w-full text-center whitespace-nowrap shrink-0 cursor-pointer",
	{
		variants: {
			sizes: {
				small: "h-10 min-w-14 rounded-[0.625rem] px-4 text-sm font-semibold", // 40px
				smallMedium: "h-11 min-w-[3.75rem] rounded-[0.625rem] px-4 text-base font-semibold", // 44px
				medium: "h-12 min-w-20 rounded-xl px-6 text-base font-semibold", // 48px
				mediumLarge: "h-14 min-w-[5.875rem] rounded-2xl px-[1.875rem] text-xl font-semibold", // 56px
				large: "h-[3.75rem] min-w-[5.875rem] rounded-2xl px-[1.875rem] text-xl font-semibold", // 60px
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

const LOADER_SIZE_MAP: Record<NonNullable<ButtonSizes>, "xs" | "sm" | "md"> = {
	small: "xs",
	smallMedium: "sm",
	medium: "sm",
	mediumLarge: "md",
	large: "md",
};

export default function Button({
	children,
	sizes = "medium",
	colors = "purple",
	className,
	isPending = false,
	disabled = false,
	type = "button",
	...props
}: ButtonProps) {
	const loaderSize = LOADER_SIZE_MAP[sizes as NonNullable<ButtonSizes>];

	return (
		<button
			type={type}
			className={cn(
				buttonVariants({ sizes, colors }),
				DISABLED_BUTTON_CLASS,
				{ "px-0": isPending },
				className,
			)}
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
