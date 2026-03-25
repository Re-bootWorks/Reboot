"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext } from "react";

interface FormStepContextValue {
	/** 현재 단계 숫자 */
	currentStep: number;
	/** 총 단계 숫자 */
	totalSteps: number;
	/** 다음 단계로 이동 */
	next: () => void;
	/** 이전 단계로 이동 */
	prev: () => void;
}

const QUERY_KEY = "step";

const FormStepContext = createContext<FormStepContextValue | null>(null);

export function useFormStep() {
	const ctx = useContext(FormStepContext);
	if (!ctx) {
		throw new Error("useFormStep는 FormStepProvider 안에서만 사용할 수 있습니다");
	}
	return ctx;
}

export default function FormStepProvider({
	step = 1,
	totalSteps,
	children,
}: {
	/** 현재 단계 숫자 */
	step?: number;
	/** 총 단계 숫자 */
	totalSteps: number;
	/** 폼 컴포넌트 */
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentStep = Number(searchParams.get("step")) || step;

	const next = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());

		params.set(QUERY_KEY, String(Number(params.get(QUERY_KEY) || 1) + 1));
		router.replace(`${pathname}?${params}`);
	}, [router, pathname, searchParams]);

	const prev = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		const current = Number(params.get(QUERY_KEY) || 1);

		params.set(QUERY_KEY, String(current - 1));
		router.replace(`${pathname}?${params}`);
	}, [router, pathname, searchParams]);

	return (
		<FormStepContext.Provider value={{ currentStep, totalSteps, next, prev }}>
			{children}
		</FormStepContext.Provider>
	);
}
