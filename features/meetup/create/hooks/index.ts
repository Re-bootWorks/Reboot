"use client";

import { useEffect, useRef } from "react";

interface UseLeaveStepProps {
	/** 현재 단계 */
	currentStep: number;
	/** 컴포넌트 단계 */
	step: number;
	/** 이 단계를 떠날 때 실행할 함수 */
	onLeave: () => void;
}
export function useLeaveStep({ currentStep, step, onLeave }: UseLeaveStepProps) {
	const prevStep = useRef(currentStep);

	// 이 단계를 떠나는 순간 한 번 실행
	useEffect(() => {
		const leftThisStep = prevStep.current === step && currentStep !== step;
		prevStep.current = currentStep;
		if (leftThisStep) {
			onLeave();
		}
	}, [currentStep, step, onLeave]);
}
