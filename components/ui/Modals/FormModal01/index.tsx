"use client";

import { Modal } from "..";

interface FormModal01Props {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	footer?: React.ReactNode;
}

export function FormModal01({ isOpen, onClose, title, footer }: FormModal01Props) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={footer}
			footerClassName="pt-10"
			className="w-[21.4375rem] p-6 pt-8 md:w-100 md:p-12">
			<div></div>
		</Modal>
	);
}
