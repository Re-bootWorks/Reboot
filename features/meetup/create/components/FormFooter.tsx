import { useQueryClient } from "@tanstack/react-query";
import { meetupListQueryKey, usePostMeetup } from "../../queries";
import { mypageQueryKeys } from "@/features/mypage/queries";
import { useFormStep } from "../providers/FormStepProvider";
import { useFormData } from "../providers/FormDataProvider";
import { useToast } from "@/providers/toast-provider";
import Button from "@/components/ui/Buttons/Button";
import type { OnSuccess } from "./CreateModal";
import { extractMeetupData } from "../utils";

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
	const queryClient = useQueryClient();
	const postMeetupMutation = usePostMeetup({
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: meetupListQueryKey });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups() });
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created() });
			onSuccess(data.id);
		},
		onError: (error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});

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
			const meetupData = extractMeetupData(data);
			postMeetupMutation.mutate(meetupData);
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
