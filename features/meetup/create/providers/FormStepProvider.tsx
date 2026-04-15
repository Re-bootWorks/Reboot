"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
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
	return {
		...ctx,
		isFirstStep: ctx.currentStep === 1,
		isLastStep: ctx.currentStep === ctx.totalSteps,
	};
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
	const { get, set } = useQueryParams();

	const currentStep = Number(get(QUERY_KEY)) || step;

	const next = useCallback(() => {
		set({ [QUERY_KEY]: String(Math.min(currentStep + 1, totalSteps)) });
	}, [set, currentStep, totalSteps]);

	const prev = useCallback(() => {
		set({ [QUERY_KEY]: String(Math.max(currentStep - 1, 1)) });
	}, [set, currentStep]);

	return (
		<FormStepContext.Provider value={{ currentStep, totalSteps, next, prev }}>
			{children}
		</FormStepContext.Provider>
	);
}
