"use client";

import { Modal } from "..";

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="w-[21.375rem] p-6 md:w-140 md:p-10 md:pt-12">
			<div></div>
		</Modal>
	);
}
