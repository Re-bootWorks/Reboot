import Button from "@/components/ui/Buttons/Button";
import { useFormStep } from "../providers/FormStepProvider";
import { useFormData } from "../providers/FormDataProvider";
import { postMeetup } from "../../apis";
import { useState } from "react";
import { useToast } from "@/providers/toast-provider";
import { OnSuccess } from "./CreateModal";

interface FormFooterProps {
	/** 닫기 버튼 클릭 시 호출 */
	onClose: () => void;
	/** 모임 생성 성공 시 호출 */
	onSuccess: OnSuccess;
}

export default function FormFooter({ onClose, onSuccess }: FormFooterProps) {
	const { handleShowToast } = useToast();
	const { currentStep, totalSteps, prev, next } = useFormStep();
	const { checkAllStepValid, getStepValid, data } = useFormData();
	const [isPending, setIsPending] = useState(false);

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
				setIsPending(true);
				const res = await postMeetup(data);
				if ("id" in res) {
					onSuccess(res.id);
				} else {
					handleShowToast({ message: res.message, status: "error" });
				}
				setIsPending(false);
			} catch (error) {
				if (error instanceof Error) {
					handleShowToast({ message: error.message, status: "error" });
				}
				setIsPending(false);
			}
		} else {
			next();
		}
	}

	return (
		<div className="grid grid-cols-2 gap-x-4">
			<Button colors="grayBorder" className="min-w-0" onClick={handleClickPrev}>
				{prevLabel}
			</Button>
			<Button
				disabled={isLastStep ? !checkAllStepValid() : !getStepValid(currentStep)}
				className="min-w-0"
				isPending={isPending}
				onClick={handleClickNext}>
				{nextLabel}
			</Button>
		</div>
	);
}
