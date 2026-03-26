import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { IcDelete } from "../../icons";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	iconSize?: "md" | "xxs";
};

export default function DeleteButton({ className, iconSize = "xxs", ...props }: ButtonProps) {
	return (
		<Button
			className={cn(
				"flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-full bg-gray-900",
				className,
			)}
			{...props}>
			<IcDelete color="gray-100" size={iconSize} />
		</Button>
	);
}
