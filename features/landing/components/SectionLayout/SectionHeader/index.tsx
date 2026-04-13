import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface SectionHeaderProps {
	eyebrow?: string;
	title: string;
	description?: ReactNode;
	align?: "left" | "center";
	className?: string;
}

export default function SectionHeader({
	eyebrow,
	title,
	description,
	align = "center",
	className,
}: SectionHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 md:gap-3",
				align === "center" ? "items-center text-center" : "items-start text-left",
				className,
			)}>
			{eyebrow ? <span className="text-sm font-semibold text-purple-500">{eyebrow}</span> : null}
			<h2 className="text-xl font-bold text-gray-800 md:text-[40px]">{title}</h2>
			{description ? (
				<p className="max-w-2xl text-base leading-6 text-gray-600 md:text-xl">{description}</p>
			) : null}
		</div>
	);
}
