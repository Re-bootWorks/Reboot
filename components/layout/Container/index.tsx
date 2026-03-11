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
			className={cn("mx-auto w-full px-4 md:px-6", narrow ? "max-w-215" : "max-w-7xl", className)}>
			{children}
		</Component>
	);
}
