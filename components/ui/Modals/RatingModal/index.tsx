"use client";

import { Modal } from "..";

interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}

export function RatingModal({ isOpen, onClose, title, footer }: RatingModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={footer}
			className="w-[21.4375rem] p-6 pt-8 md:w-100 md:p-12">
			<div></div>
		</Modal>
	);
}
