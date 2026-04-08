import { cn } from "@/utils/cn";
import { useFormStep } from "../providers/FormStepProvider";

interface FormHeaderProps {
	/** 추가 클래스명 */
	className?: string;
}
export default function FormHeader({ className }: FormHeaderProps) {
	const { currentStep, totalSteps } = useFormStep();

	return (
		<div className={cn("flex items-center gap-x-3 text-2xl", className)}>
			<h1 className="whitespace-nowrap text-gray-900">{TITLE}</h1>
			<div className="whitespace-nowrap text-gray-400">
				<span className="text-gray-600">{currentStep}</span>
				<span>/</span>
				<span>{totalSteps}</span>
			</div>
		</div>
	);
}

const TITLE = "모임 만들기";
