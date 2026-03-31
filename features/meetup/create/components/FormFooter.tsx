import Button from "@/components/ui/Buttons/Button";
import { useFormStep } from "../providers/FormStepProvider";
import { useFormData } from "../providers/FormDataProvider";
import { useToast } from "@/providers/toast-provider";
import type { OnSuccess } from "./CreateModal";
import { extractMeetupData } from "../utils";
import { usePostMeetup } from "../../queries";

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
	const postMeetupMutation = usePostMeetup();

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
				const meetupData = extractMeetupData(data);
				const res = await postMeetupMutation.mutateAsync(meetupData);
				if ("id" in res) {
					onSuccess(res.id);
				} else {
					handleShowToast({ message: res.message, status: "error" });
				}
			} catch (error) {
				if (error instanceof Error) {
					handleShowToast({ message: error.message, status: "error" });
				}
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
				isPending={postMeetupMutation.isPending}
				onClick={handleClickNext}>
				{nextLabel}
			</Button>
		</div>
	);
}
