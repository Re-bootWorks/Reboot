import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { IcPlus } from "../../icons";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	children?: React.ReactNode;
};

export default function CreateButton({ children, className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn(
				"font-pretendard flex cursor-pointer items-center justify-center gap-2.5 rounded-3xl bg-purple-500 font-bold text-white",
				"h-12 w-12",
				"md:h-16 md:w-auto md:min-w-47 md:px-7 md:py-4 md:text-xl",
				className,
			)}
			{...props}>
			<IcPlus />
			<span className="hidden md:inline">{children}</span>
		</Button>
	);
}
