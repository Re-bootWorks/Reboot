import { useFormStep } from "../providers/FormStepProvider";

interface FormHeaderProps {
	/** 폼 제목 컴포넌트 */
	children: React.ReactNode;
}
export default function FormHeader({ children }: FormHeaderProps) {
	const { currentStep, totalSteps } = useFormStep();

	return (
		<div className="flex items-center gap-x-3 text-2xl">
			<h1 className="whitespace-nowrap text-gray-900">{children}</h1>
			<div className="whitespace-nowrap text-gray-400">
				<span className="text-gray-600">{currentStep}</span>
				<span>/</span>
				<span>{totalSteps}</span>
			</div>
		</div>
	);
}
