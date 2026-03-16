"use client";

import { Modal } from "..";

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="w-[21.4375rem] pt-8 pb-14 md:w-100 md:pt-12 md:pb-16">
			<div></div>
		</Modal>
	);
}
