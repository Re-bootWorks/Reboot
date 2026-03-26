"use client";

import Button from "@/components/ui/Buttons/Button";
import { Modal } from "@/components/ui/Modals";

const STYLE = {
	modal: "min-h-100 w-[calc(100%-32px)] max-w-136 p-6 pt-8 md:w-full md:p-12",
	modalButton: "shrink md:h-15 md:rounded-2xl md:text-xl",
};

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="프로필 수정하기"
			className={STYLE.modal}
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
						type="submit"
						colors="purple"
						sizes="medium"
						onClick={onClose}
						className={STYLE.modalButton}>
						수정하기
					</Button>
				</div>
			}>
			<div>마이 프로필 모달</div>
		</Modal>
	);
}
