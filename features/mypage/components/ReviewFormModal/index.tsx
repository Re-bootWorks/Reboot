"use client";

import Button from "@/components/ui/Buttons/Button";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import { Modal } from "@/components/ui/Modals";
import { RATING_STYLE } from "@/constants/ratingStyle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "@smastrom/react-rating";
import { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/utils/cn";
import rating from "./style.module.css";
import Alert from "@/components/ui/Modals/AlertModal";
import useToggle from "@/hooks/useToggle";

const STYLE = {
	modal: "min-h-100 w-[calc(100%-32px)] max-w-136 p-6 pt-8 md:w-full md:p-12",
	modalButton: "shrink md:h-15 md:rounded-2xl md:text-xl",
	formLabel: "pb-2.5 text-sm md:text-base",
	errorMsg: "text-error mt-2 px-1 text-xs font-medium md:text-sm",
};

const reviewFormSchema = z.object({
	score: z.number().min(1, "평점을 선택해 주세요.").max(5),
	comment: z.string().trim().min(1, "리뷰 내용을 입력해 주세요."),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormModalProps {
	/** 작성 모드인지 수정 모드인지 구분 */
	mode: "create" | "edit";
	/** 수정 모드를 위한 초기값 */
	initialValue?: Partial<ReviewFormValues>;
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 제출 중 로딩 상태 */
	isPending?: boolean;
	/** 모달을 닫는 외부 핸들러 */
	onClose: () => void;
	/** 폼 제출 액션 함수 */
	handleFormSubmit: (reviewFormValues: ReviewFormValues) => Promise<void> | void;
}

// form 기본값 생성
function getReviewDefaultValues(initialValue?: Partial<ReviewFormValues>): ReviewFormValues {
	return {
		score: initialValue?.score ?? 0,
		comment: initialValue?.comment ?? "",
	};
}

export default function ReviewFormModal({
	mode,
	initialValue,
	isOpen,
	isPending = false,
	onClose,
	handleFormSubmit,
}: ReviewFormModalProps) {
	const { isOpen: alertOpen, open, close } = useToggle();
	const reviewFormId = useId();
	const reviewScoreId = useId();
	const reviewContentId = useId();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewFormSchema),
		defaultValues: getReviewDefaultValues(initialValue),
	});

	useEffect(() => {
		if (!isOpen) return;

		// 수정 대상이 바뀌거나 모달이 다시 열리면 폼 값을 초기화
		reset(getReviewDefaultValues(initialValue));
	}, [initialValue, isOpen, reset]);

	// 리뷰 작성 중 취소 시 Alert
	function handleReviewCancel() {
		open();
	}

	// 리뷰 모달 닫기
	function handleReviewClose() {
		reset(getReviewDefaultValues(initialValue));
		onClose();
	}

	// 리뷰 제출
	const handleReviewSubmit = handleSubmit(async (reviewFormValues) => {
		await handleFormSubmit(reviewFormValues);
		handleReviewClose();
	});

	const reviewFormTitle = mode === "create" ? "리뷰 작성" : "리뷰 수정";
	const reviewFormSubmitLabel = mode === "create" ? "작성 완료" : "수정 완료";

	return (
		<>
			<Modal
				className={STYLE.modal}
				isOpen={isOpen}
				onClose={handleReviewClose}
				title={reviewFormTitle}
				footer={
					<div className="flex gap-3">
						<Button
							colors="grayBorder"
							sizes="medium"
							onClick={handleReviewCancel}
							className={STYLE.modalButton}>
							취소
						</Button>
						<Button
							type="submit"
							form={reviewFormId}
							colors="purple"
							sizes="medium"
							isPending={isPending}
							className={STYLE.modalButton}
							disabled={!isValid}>
							{reviewFormSubmitLabel}
						</Button>
					</div>
				}>
				<form id={reviewFormId} onSubmit={handleReviewSubmit} className="space-y-8" noValidate>
					<div>
						<div id={reviewScoreId} className={STYLE.formLabel}>
							만족스러운 경험이었나요? <span className="text-purple-500">*</span>
						</div>
						<Controller
							name="score"
							control={control}
							render={({ field }) => (
								<>
									<Rating
										isRequired
										value={field.value}
										visibleLabelId={reviewScoreId}
										onChange={field.onChange}
										onBlur={field.onBlur}
										itemStyles={RATING_STYLE}
										className={cn(rating.review, "max-w-54")}
									/>
									{errors.score && <p className={STYLE.errorMsg}>{errors.score.message}</p>}
								</>
							)}
						/>
					</div>

					<div>
						<label htmlFor={reviewContentId} className={cn(STYLE.formLabel, "block")}>
							좋았던 점을 자유롭게 적어주세요. <span className="text-purple-500">*</span>
						</label>
						<Controller
							name="comment"
							control={control}
							render={({ field }) => (
								<InputTextarea
									id={reviewContentId}
									name={field.name}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
									isRequired
									disabled={isPending}
									isDestructive={!!errors.comment}
									hintText={errors.comment?.message}
								/>
							)}
						/>
					</div>
				</form>
			</Modal>
			<Alert isOpen={alertOpen} onClose={close} handleConfirmButton={handleReviewClose}>
				{reviewFormTitle}을 취소하시겠습니까?
			</Alert>
		</>
	);
}
