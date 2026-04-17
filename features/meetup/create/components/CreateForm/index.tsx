"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useToggle from "@/hooks/useToggle";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/utils/cn";
import { Modal } from "@/components/ui/Modals";
import { usePostMeetup, useUploadMeetupImage } from "../../../queries";
import { MeetupCreateRequest } from "../../../types";
import { getKakaoPlace } from "../../../apis";
import { modalSizeStyle } from "../../../styles";
import { extractMeetupData } from "../../utils";
import { useCreateMeetup } from "../../hooks";
import FormStepProvider, { useFormStep } from "../../providers/FormStepProvider";
import FormDataProvider, { useFormData } from "../../providers/FormDataProvider";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";
import StepTypeSelect from "../StepTypeSelect";
import StepInfo from "../StepInfo";
import StepSchedule from "../StepSchedule";
import StepDesc from "../StepDesc";
import { mypageQueryKeys } from "@/features/shared/queryKeys/mypage";
import { meetupQueryKeys } from "@/features/shared/queryKeys/meetup";

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
					<FormHeader className="shrink-0 pb-4 md:pb-12" />
					<CreateForm onClose={onClose} onSuccess={onSuccess} footerClassName="pt-4 md:pt-12" />
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
			queryClient.invalidateQueries({ queryKey: mypageQueryKeys.meetups.all }); // 참여한 / 만든 모임 목록
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
		const isEnterKey = e.key === "Enter";
		const isComposing = e.nativeEvent.isComposing;
		if (!isEnterKey || isComposing) return;

		// Enter 키의 기본 동작이 있는 요소는 제외
		const isInteractiveElement =
			e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement;
		if (isInteractiveElement) return;

		// Tab focus를 위해 이후부터 preventDefault 처리
		e.preventDefault();
		void goNextStep();
	}

	function handleBlurCaptureForm() {
		requestAnimationFrame(() => {
			const form = formRef.current;
			const focusedElement = document.activeElement;

			// 폼 내부 요소에 포커스가 있는 경우 통과
			const isInsideForm = form?.contains(focusedElement);
			if (isInsideForm) return;

			// 폼 내부에서 포털을 사용한 요소(드롭다운 등)를 클릭한 경우 통과
			const isFocusLost = focusedElement === document.body;
			const isFocusOnModal = focusedElement === form?.closest('[role="dialog"]');
			if (!isFocusLost && !isFocusOnModal) return;

			form?.focus();
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
							key={Comp.key}
							inert={isInvisible || undefined}
							aria-hidden={isInvisible ? "true" : "false"}>
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
