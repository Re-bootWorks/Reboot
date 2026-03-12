import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";
import { IcEditOutline } from "../../icons";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
};

export default function EditButton({ className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn(
				"flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white",
				className,
			)}
			{...props}>
			<IcEditOutline />
		</Button>
	);
}
