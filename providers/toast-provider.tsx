"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { usePathname } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { ToastBoxProps, ToastContent } from "@/components/ui/Toast/type";

type ToastContextValue = {
	handleShowToast: (payload: ToastContent) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastBoxProps[]>([]);
	const timerRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
	const pathname = usePathname();

	const clearAllTimers = useCallback(() => {
		timerRef.current.forEach(clearTimeout);
		timerRef.current.clear();
	}, []);

	const handleShowToast = useCallback((payload: ToastContent) => {
		const { message, status, duration = 3000 } = payload;
		const toastId = Date.now() + Math.random();

		setToasts((prev) => [...prev, { id: toastId, message, status }]);

		const timerId = setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== toastId));
			timerRef.current.delete(timerId);
		}, duration);

		timerRef.current.add(timerId);
	}, []);

	useEffect(() => {
		return () => {
			clearAllTimers();
			setToasts([]);
		};
	}, [pathname, clearAllTimers]);

	const contextValue = useMemo(() => ({ handleShowToast }), [handleShowToast]);

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			<Toast toasts={toasts} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있습니다");
	}
	return ctx;
}
