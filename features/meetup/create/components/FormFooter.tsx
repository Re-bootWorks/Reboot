import Button from "@/components/ui/Buttons/Button";
import { useFormStep } from "../providers/FormStepProvider";
import { useFormData } from "../providers/FormDataProvider";
import { OnSubmit } from "./CreateModal";

interface FormFooterProps {
	/** 닫기 버튼 클릭 시 호출 */
	onClose: () => void;
	/** 제출 버튼 클릭 시 호출 */
	onSubmit: OnSubmit;
	/** 제출 버튼 로딩 상태 */
	isPending: boolean;
}

export default function FormFooter({ onClose, onSubmit, isPending }: FormFooterProps) {
	const { currentStep, totalSteps, prev, next } = useFormStep();
	const { checkAllStepValid, getStepValid, data } = useFormData();
	const isFirstStep = currentStep === 1;
	const isLastStep = currentStep === totalSteps;
	const prevLabel = isFirstStep ? "취소" : "이전";
	const nextLabel = isLastStep ? "모임 만들기" : "다음";

	function handleClickPrev() {
		if (isFirstStep) {
			onClose();
		} else {
			prev();
		}
	}

	async function handleClickNext() {
		if (isLastStep) {
			try {
				await onSubmit(data);
				onClose();
			} catch (error) {
				if (error instanceof Error) {
					// TODO: 토스트 에러 표시
					console.error(error.message);
				}
			}
		} else {
			next();
		}
	}

	return (
		<div className="flex justify-between gap-x-4">
			<Button colors="grayBorder" className="flex-1" onClick={handleClickPrev}>
				{prevLabel}
			</Button>
			<Button
				disabled={isLastStep ? !checkAllStepValid() : !getStepValid(currentStep)}
				className="flex-1"
				isPending={isPending}
				onClick={handleClickNext}>
				{nextLabel}
			</Button>
		</div>
	);
}
