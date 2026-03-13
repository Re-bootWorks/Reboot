import { VariantProps } from "class-variance-authority";
import { utilityVariants } from ".";
import type { ButtonHTMLAttributes } from "react";

export type UtilitySizes = NonNullable<VariantProps<typeof utilityVariants>["sizes"]>;

export interface UtilityProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof utilityVariants> {
	sizes?: UtilitySizes;
	pressed?: boolean;
	isPending?: boolean;
}
