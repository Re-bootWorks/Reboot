"use client";

import { Modal } from "..";

interface SelectGridModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}

export function SelectGridModal({ isOpen, onClose, title, footer }: SelectGridModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={footer}
			className="w-[21.4375rem] p-6 pt-8 md:w-136 md:p-12">
			<div></div>
		</Modal>
	);
}
