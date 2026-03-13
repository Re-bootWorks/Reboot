import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from ".";

export type ButtonSizes = VariantProps<typeof buttonVariants>["sizes"];
export type ButtonColors = VariantProps<typeof buttonVariants>["colors"];

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	children: ReactNode;
	isPending?: boolean;
}
