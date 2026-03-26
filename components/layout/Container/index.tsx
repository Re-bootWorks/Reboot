import { cn } from "@/utils/cn";
import { ElementType, ReactNode } from "react";

interface ContainerProps {
	as?: ElementType;
	narrow?: boolean;
	className?: string;
	children: ReactNode;
}

export default function Container({
	as: Component = "section",
	narrow = false,
	className,
	children,
}: ContainerProps) {
	return (
		<Component
			className={cn("mx-auto w-full px-4 md:px-6", narrow ? "max-w-227" : "max-w-332", className)}>
			{children}
		</Component>
	);
}
