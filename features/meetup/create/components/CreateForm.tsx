"use client";

import { Modal } from "@/components/ui/Modals";
import { cn } from "@/utils/cn";
import { MeetupCreateRequest } from "../../types";
import { getKakaoPlace } from "../../apis";
import { meetupQueryKeys, usePostMeetup, useUploadMeetupImage } from "../../queries";
import FormStepProvider, { useFormStep } from "../providers/FormStepProvider";
import FormDataProvider, { useFormData } from "../providers/FormDataProvider";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import StepTypeSelect from "./StepTypeSelect";
import StepInfo from "./StepInfo";
import StepSchedule from "./StepSchedule";
import StepDesc from "./StepDesc";
import { modalSizeStyle } from "../../styles";
import { useToast } from "@/providers/toast-provider";
import { useQueryClient } from "@tanstack/react-query";
import { mypageQueryKeys } from "@/features/mypage/queries";
import { extractMeetupData } from "../utils";
import { useEffect, useRef } from "react";
import { useCreateMeetup } from "../hooks";
import useToggle from "@/hooks/useToggle";

export type OnSubmit = (data: MeetupCreateRequest) => Promise<void>;
export type OnSuccess = (id: number) => void;

const TOTAL_STEPS = 4;

export function CreateFormModal() {
	const { isOpen, close } = useToggle(true);
	const { onClose, onSuccess } = useCreateMeetup({ close });

	return (
		<FormStepProvider totalSteps={TOTAL_STEPS}>
			<FormDataProvider totalSteps={TOTAL_STEPS}>
				<Modal className={modalSizeStyle} isOpen={isOpen} onClose={onClose} title={<FormHeader />}>
					<CreateForm onClose={onClose} onSuccess={onSuccess} footerClassName="pt-8 md:pt-14" />
				</Modal>
			</FormDataProvider>
		</FormStepProvider>
	);
}

export function CreateFormView() {
	const { onClose, onSuccess } = useCreateMeetup();

	return (
		<FormStepProvider totalSteps={TOTAL_STEPS}>
			<FormDataProvider totalSteps={TOTAL_STEPS}>
				<div
					className={cn(
						"flex h-full min-h-0 w-full max-w-lg flex-col items-stretch rounded-2xl bg-white p-6 shadow-lg",
						"md:max-w-none md:rounded-none md:bg-transparent md:p-0 md:shadow-none",
					)}>
					<FormHeader className="shrink-0 pb-8 md:pb-12" />
					<CreateForm onClose={onClose} onSuccess={onSuccess} footerClassName="mt-auto" />
				</div>
			</FormDataProvider>
		</FormStepProvider>
	);
}

interface CreateFormProps {
	/** 모달 닫기 시 호출 */
	onClose: () => void;
	/** 모임 생성 성공 시 호출 */
	onSuccess: OnSuccess;
	/** 푸터 컴포넌트 추가 클래스 */
	footerClassName?: string;
}
function CreateForm({ onClose, onSuccess, footerClassName }: CreateFormProps) {
	const uploadImage = useUploadMeetupImage();
	const formRef = useRef<HTMLFormElement>(null);
	const { handleShowToast } = useToast();
	const { currentStep, next, prev, isFirstStep, isLastStep } = useFormStep();
	const { getStepValid, data } = useFormData();
	const queryClient = useQueryClient();
	const postMeetupMutation = usePostMeetup({
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: meetupQueryKeys.list }); // 모임 목록
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups }); // 참여한 모임 목록
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.created }); // 만든 모임 목록
			onSuccess(data.id);
		},
		onError: (error) => {
			handleShowToast({ message: error.message, status: "error" });
		},
	});

	const STEP_COMPS = [
		<StepTypeSelect key="type" step={1} />,
		<StepInfo
			key="info"
			step={2}
			uploadImageFn={uploadImage.mutateAsync}
			getKakaoPlaceFn={getKakaoPlace}
		/>,
		<StepDesc key="desc" step={3} />,
		<StepSchedule key="schedule" step={4} />,
	];

	async function goNextStep() {
		if (!getStepValid(currentStep)) return;
		if (isLastStep) {
			const meetupData = extractMeetupData(data);
			await postMeetupMutation.mutateAsync(meetupData);
		} else {
			next();
		}
	}

	function handleSubmitForm(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		void goNextStep();
	}

	function handleKeyDownForm(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
		if (e.target instanceof HTMLTextAreaElement) return;
		e.preventDefault();
		void goNextStep();
	}

	function handleBlurCaptureForm() {
		// textarea에서 onBlur될 때 body가 아닌 form에 focus가 되도록 함(캡쳐링)
		requestAnimationFrame(() => {
			if (!formRef.current?.contains(document.activeElement)) {
				formRef.current?.focus();
			}
		});
	}

	function handleClickPrev() {
		if (isFirstStep) {
			onClose();
		} else {
			prev();
		}
	}

	useEffect(() => {
		formRef.current?.focus();
	}, []);

	return (
		<form
			ref={formRef}
			tabIndex={-1}
			onBlurCapture={handleBlurCaptureForm}
			noValidate
			className="flex min-h-0 w-full flex-1 flex-col overflow-hidden outline-none"
			onSubmit={handleSubmitForm}
			onKeyDown={handleKeyDownForm}>
			<div className="flex min-h-0 w-full flex-1 flex-col">
				{STEP_COMPS.map((Comp) => {
					const isInvisible = Comp.props.step !== currentStep;
					return (
						<div
							className={cn("w-full shrink-0", isInvisible && "h-0 overflow-hidden")}
							key={Comp.key}>
							{Comp}
						</div>
					);
				})}
			</div>
			<FormFooter
				handleClickPrev={handleClickPrev}
				isPending={postMeetupMutation.isPending}
				className={cn("shrink-0", footerClassName)}
			/>
		</form>
	);
}
