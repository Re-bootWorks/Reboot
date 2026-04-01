import Empty from "@/components/layout/Empty";
import Button from "@/components/ui/Buttons/Button";
import { FallbackProps } from "react-error-boundary";

interface ErrorFallbackProps extends FallbackProps {
	prefix?: string;
	title?: string;
	description?: string;
}

export default function ErrorFallback({
	resetErrorBoundary,
	prefix,
	title = "불러오지 못했습니다.",
	description = "잠시 후 다시 시도해주세요.",
}: ErrorFallbackProps) {
	return (
		<>
			<Empty>
				<p>
					{prefix}
					{title}
				</p>
				<p>{description}</p>
				<Button sizes="small" className="mx-auto mt-4 w-30" onClick={resetErrorBoundary}>
					다시 시도
				</Button>
			</Empty>
		</>
	);
}
