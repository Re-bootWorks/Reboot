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
	footerClassName?: string;
	isCenterTitle?: boolean;
	hideCloseButton?: boolean;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	className = "",
	footerClassName,
	isCenterTitle = false,
	hideCloseButton = false,
}: ModalProps) {
	return (
		<Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
			<div className="bg-black-50 fixed inset-0" />
			<div className="fixed inset-0 flex items-center justify-center px-4">
				<DialogPanel
					className={cn(
						"relative flex max-h-2/3 w-full flex-col bg-white shadow-xl",
						"rounded-3xl p-6 md:rounded-[2.5rem] md:p-12",
						className,
					)}>
					<div
						className={cn(
							"flex items-center pb-8 md:pb-12",
							isCenterTitle ? "relative justify-center" : "justify-between",
						)}>
						{title ? (
							<DialogTitle as="h2" className="text-lg font-semibold text-gray-900 md:text-2xl">
								{title}
							</DialogTitle>
						) : (
							<div />
						)}
						{!hideCloseButton && (
							<button
								type="button"
								onClick={onClose}
								aria-label="모달 닫기"
								className={cn("cursor-pointer", isCenterTitle && "absolute right-0")}>
								<IcDelete />
							</button>
						)}
					</div>
					<div className="scrollbar flex-1 overflow-y-auto">{children}</div>
					{footer && <div className={cn("pt-8 md:pt-14", footerClassName)}>{footer}</div>}
				</DialogPanel>
			</div>
		</Dialog>
	);
}
