"use client";
import { cn } from "@/utils/cn";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Status, ToastBoxProps } from "./type";

interface ToastBoxDisplayProps {
	status?: Status;
	children: ReactNode;
}

export function ToastBox({ status, children }: ToastBoxDisplayProps) {
	return (
		<div
			className={cn(
				!status ? "bg-black-70" : status === "success" ? "bg-green-500" : "bg-error",
				"w-fit rounded-[0.625rem] px-6 py-3 text-center text-xs font-semibold break-keep text-white md:rounded-xl md:px-8 md:py-4 md:text-base",
			)}>
			{children}
		</div>
	);
}

export default function Toast({ toasts }: { toasts: ToastBoxProps[] }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return createPortal(
		<div className="fixed bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4">
			{toasts.map((toast) => {
				const { id, status, message } = toast;
				return (
					<ToastBox key={id} status={status}>
						{message}
					</ToastBox>
				);
			})}
		</div>,
		document.body,
	);
}
