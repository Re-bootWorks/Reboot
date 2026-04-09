import { useFormStep } from "../../providers/FormStepProvider";
import { useFormData } from "../../providers/FormDataProvider";
import Button from "@/components/ui/Buttons/Button";
import { cn } from "@/utils/cn";

interface FormFooterProps {
	/** 이전 버튼 클릭 시 호출 */
	handleClickPrev: (e: React.PointerEvent<HTMLButtonElement>) => void;
	/** 폼 제출 진행 상태 */
	isPending: boolean;
	/** 추가 클래스명 */
	className?: string;
}

export default function FormFooter({ handleClickPrev, isPending, className }: FormFooterProps) {
	const { currentStep, isFirstStep, isLastStep } = useFormStep();
	const { checkAllStepValid, getStepValid } = useFormData();

	const prevLabel = isFirstStep ? "취소" : "이전";
	const nextLabel = isLastStep ? "모임 만들기" : "다음";

	return (
		<div className={cn("grid grid-cols-2 gap-x-4", className)}>
			<Button colors="grayBorder" className="min-w-0" onClick={handleClickPrev}>
				{prevLabel}
			</Button>
			<Button
				type="submit"
				disabled={isLastStep ? !checkAllStepValid() : !getStepValid(currentStep)}
				className="min-w-0"
				isPending={isPending}>
				{nextLabel}
			</Button>
		</div>
	);
}
