import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { IcBye } from "../../icons";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
};

export default function SendButton({ className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn(
				"flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white ring-1 ring-gray-200",
				className,
			)}
			{...props}>
			<IcBye />
		</Button>
	);
}
