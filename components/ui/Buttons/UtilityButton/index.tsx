import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { IcHeart, IcHeartOutline } from "../../icons";
import animations from "./style.module.css";
import { ButtonHTMLAttributes } from "react";

export const utilityVariants = cva(
	"bg-white border border-gray-200 rounded-full flex justify-center items-center shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
	{
		variants: {
			sizes: {
				small: "size-10", // 40px
				medium: "size-12", // 48px
				large: "size-15", // 60px
			},
		},
		defaultVariants: {
			sizes: "medium",
		},
	},
);

export type UtilitySizes = NonNullable<VariantProps<typeof utilityVariants>["sizes"]>;

export interface UtilityProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof utilityVariants> {
	sizes?: UtilitySizes;
	pressed?: boolean;
	isPending?: boolean;
}

const ICON_SIZE_MAP: Record<UtilitySizes, "sm" | "md" | "lg"> = {
	small: "sm",
	medium: "md",
	large: "lg",
};

export default function UtilityButton({
	sizes = "medium",
	pressed = false,
	className,
	isPending = false,
	disabled = false,
	type = "button",
	...props
}: UtilityProps) {
	const iconSize = ICON_SIZE_MAP[sizes];
	const ariaLabel = pressed ? "찜 취소" : "찜 하기";
	const isButtonDisabled = isPending || disabled;

	return (
		<button
			type={type}
			className={cn(utilityVariants({ sizes }), className)}
			disabled={isButtonDisabled}
			aria-busy={isPending}
			aria-pressed={pressed}
			aria-label={ariaLabel}
			{...props}>
			<span
				key={pressed ? "pressed" : "unpressed"}
				className={cn(
					"inline-flex items-center justify-center",
					pressed ? animations.iconBounce : animations.iconBounceShort,
				)}>
				{pressed ? (
					<IcHeart size={iconSize} isGradient color="purple-400" />
				) : (
					<IcHeartOutline size={iconSize} color="gray-400" />
				)}
			</span>
		</button>
	);
}
