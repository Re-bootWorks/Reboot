import LoaderDots, { SIZE_MAP } from "@/components/ui/LoaderDots";
import { cn } from "@/utils/cn";

interface LoadingProps {
	size?: keyof typeof SIZE_MAP;
	className?: string;
}

export default function Loading({ size = "lg", className }: LoadingProps) {
	return (
		<div className={cn("flex justify-center py-4", className)}>
			<LoaderDots size={size} />
		</div>
	);
}
