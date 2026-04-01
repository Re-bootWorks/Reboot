"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

//페이지를 떠나려 할 때 확인 모달을 띄워주는 커스텀 훅
export function useLeaveConfirm(isDirty: boolean) {
	const [showModal, setShowModal] = useState(false);
	const pendingUrlRef = useRef<string | null>(null);
	const isLeavingRef = useRef(false);
	const router = useRouter();

	// 브라우저 새로고침 / 탭 닫기 차단
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	// Next.js 링크 클릭 가로채기
	useEffect(() => {
		if (!isDirty) return;

		const handleClick = (e: MouseEvent) => {
			if (isLeavingRef.current) return;

			const target = (e.target as HTMLElement).closest("a");
			if (!target) return;

			const href = target.getAttribute("href");
			if (!href || href.startsWith("#")) return;

			e.preventDefault();
			pendingUrlRef.current = href;
			setShowModal(true);
		};

		document.addEventListener("click", handleClick, true);
		return () => document.removeEventListener("click", handleClick, true);
	}, [isDirty]);

	const handleConfirmLeave = () => {
		isLeavingRef.current = true;
		setShowModal(false);
		if (pendingUrlRef.current) {
			router.push(pendingUrlRef.current);
		}
	};

	const handleCancelLeave = () => {
		setShowModal(false);
		pendingUrlRef.current = null;
	};

	return { showModal, handleConfirmLeave, handleCancelLeave };
}
