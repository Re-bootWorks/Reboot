"use client";

import { Modal } from "..";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}

export function LoginModal({ isOpen, onClose, title, footer }: LoginModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={footer}
			className="w-[21.4375rem] px-4 py-6 md:w-142 md:px-14 md:pt-12 md:pb-11">
			<div></div>
		</Modal>
	);
}
