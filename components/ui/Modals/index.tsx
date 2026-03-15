"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IcDelete } from "../icons";
import { cn } from "@/utils/cn";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className = "" }: ModalProps) {
	return (
		<Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
			<div className="bg-black-50 fixed inset-0" />
			<div className="fixed inset-0 flex items-center justify-center px-4">
				<DialogPanel
					className={cn(
						"relative flex w-full flex-col bg-white shadow-xl",
						"rounded-3xl px-6 py-6 md:rounded-[2.5rem] md:px-12 md:py-12",
						className,
					)}>
					<div className="flex items-center justify-between">
						{title ? (
							<DialogTitle as="h2" className="text-lg font-semibold text-gray-900 md:text-2xl">
								{title}
							</DialogTitle>
						) : (
							<div />
						)}
						<button
							type="button"
							onClick={onClose}
							aria-label="모달 닫기"
							className="cursor-pointer">
							<IcDelete />
						</button>
					</div>
					<div className="flex-1 overflow-y-auto pt-8 md:pt-12">{children}</div>
					{footer && <div className="pt-10 md:pt-14">{footer}</div>}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
