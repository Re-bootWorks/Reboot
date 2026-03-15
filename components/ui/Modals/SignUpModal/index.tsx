"use client";

import { Modal } from "..";

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}

export function SignUpModal({ isOpen, onClose, title, footer }: SignUpModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={footer}
			className="w-[21.4375rem] p-6 md:w-142 md:px-14 md:py-10">
			<div></div>
		</Modal>
	);
}
