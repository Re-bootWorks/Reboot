"use client";

import Button from "@/components/ui/Buttons/Button";
import { Modal } from "@/components/ui/Modals";
import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes } from "react";

const STYLE = {
	modal: "w-[calc(100%-32px)] max-w-136 p-6 pt-8 md:w-full md:p-12",
	modalButton: "shrink md:h-15 md:rounded-2xl md:text-xl",
};

interface AlertModalProps {
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 모달을 닫는 외부 핸들러 */
	onClose: () => void;
	/** 확인 버튼 타입 */
	confirmButtonType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	/** 확인 버튼 로딩 여부 */
	isPending?: boolean;
	/** 확인 버튼 텍스트 */
	confirmLabel?: string;
	/** 확인 버튼 함수 */
	handleConfirmButton: () => void | Promise<void>;
	/** 메세지 영역 ClassName */
	className?: string;
	/** Alert 메세지 */
	children: React.ReactNode;
}

export default function Alert({
	isOpen,
	onClose,
	confirmButtonType = "button",
	isPending = false,
	confirmLabel = "확인",
	handleConfirmButton,
	className,
	children,
}: AlertModalProps) {
	const handleConfirmAction = async () => {
		await handleConfirmButton();
		onClose();
	};

	return (
		<Modal
			className={STYLE.modal}
			isOpen={isOpen}
			onClose={onClose}
			footer={
				<div className="flex gap-3">
					<Button
						colors="grayBorder"
						sizes="medium"
						onClick={onClose}
						className={STYLE.modalButton}>
						취소
					</Button>
					<Button
						type={confirmButtonType}
						colors="purple"
						sizes="medium"
						isPending={isPending}
						className={STYLE.modalButton}
						onClick={handleConfirmAction}>
						{confirmLabel}
					</Button>
				</div>
			}>
			<div className={cn("text-center text-lg font-semibold md:text-xl", className)}>
				{children}
			</div>
		</Modal>
	);
}
