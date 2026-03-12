import { Button } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { IcPlus } from "../../icons";

const createButtonVariants = cva(
	"font-pretendard flex cursor-pointer items-center justify-center gap-2.5 rounded-3xl bg-purple-500 text-xl font-bold text-white",
	{
		variants: {
			size: {
				Small: "h-12 w-12",
				Large: "h-16 min-w-47 px-7 py-4",
			},
		},
		defaultVariants: {
			size: "Large",
		},
	},
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	size?: "Large" | "Small";
	className?: string;
	children?: React.ReactNode;
};

export default function CreateButton({
	children,
	size = "Large",
	className,
	...props
}: ButtonProps) {
	return (
		<Button className={cn(createButtonVariants({ size }), className)} {...props}>
			<IcPlus />
			{size === "Large" && children}
		</Button>
	);
}
