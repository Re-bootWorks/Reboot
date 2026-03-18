import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { IcBye } from "../../icons";
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const sendButtonVariants = cva(
	"flex cursor-not-allowed items-center justify-center rounded-full bg-white ring-1 ring-gray-200",
	{
		variants: {
			sizes: {
				small: "size-10",
				medium: "size-12",
				large: "size-15",
			},
		},
		defaultVariants: {
			sizes: "medium",
		},
	},
);

type SendButtonSizes = NonNullable<VariantProps<typeof sendButtonVariants>["sizes"]>;

const ICON_SIZE_MAP: Record<SendButtonSizes, "sm" | "md" | "lg"> = {
	small: "sm",
	medium: "md",
	large: "lg",
};

interface SendButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	sizes?: SendButtonSizes;
	className?: string;
}

export default function SendButton({ className, sizes = "medium", ...props }: SendButtonProps) {
	const iconSize = ICON_SIZE_MAP[sizes];
	return (
		<Button className={cn(sendButtonVariants({ sizes }), className)} {...props}>
			<IcBye size={iconSize} />
		</Button>
	);
}
