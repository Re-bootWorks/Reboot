import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import Container from "@/components/layout/Container";

interface SectionContainerProps {
	children: ReactNode;
	className?: string;
}

export default function SectionContainer({ children, className }: SectionContainerProps) {
	return <Container className={cn(className)}>{children}</Container>;
}
