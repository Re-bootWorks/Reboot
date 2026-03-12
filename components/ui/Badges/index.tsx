import { cn } from "@/utils/cn";

type BadgeVariant = "scheduled" | "pending" | "completed" | "confirmed" | "completedAlt";

interface BadgeProps {
	children: React.ReactNode;
	variant?: BadgeVariant;
	className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
	scheduled: "bg-purple-200 text-purple-600 font-semibold",
	pending: "bg-white border border-gray-200 text-gray-500 font-medium",
	completed: "bg-gray-100 text-gray-600 font-medium",
	confirmed: "border-gradient-purple border pl-2 pr-3 gap-0.5",
	completedAlt: "bg-linear-to-r from-purple-100 to-purple-200 text-gray-600 font-medium",
};

export function Badge({ children, variant = "scheduled", className }: BadgeProps) {
	return (
		<div
			className={cn(
				"inline-flex h-8 items-center rounded-3xl py-1.5 text-sm",
				variant === "confirmed" ? "" : "gap-2.5 px-3",
				variantStyles[variant],
				className,
			)}>
			{children}
		</div>
	);
}
