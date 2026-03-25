"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MeetupCreateData } from "../types";

interface FormDataContextValue {
	/** 단계 유효성 조회 */
	getStepValid: (step: number) => boolean;
	/** 모든 단계 유효성 조회 */
	checkAllStepValid: () => boolean;
	/** 단계 유효성 설정 */
	setStepValid: (step: number, isValid: boolean) => void;
	/** 데이터 조회 */
	data: MeetupCreateData;
	/** 데이터 설정 */
	setData: React.Dispatch<React.SetStateAction<MeetupCreateData>>;
}

const FormDataContext = createContext<FormDataContextValue | null>(null);

export function useFormData() {
	const ctx = useContext(FormDataContext);
	if (!ctx) {
		throw new Error("useFormData는 FormDataProvider 안에서만 사용할 수 있습니다");
	}
	return ctx;
}

const initialData: MeetupCreateData = {
	name: "",
	type: "",
	region: "",
	address: "",
	latitude: 0,
	longitude: 0,
	dateTime: "",
	registrationEnd: "",
	capacity: 0,
	image: "",
	description: "",
};

export default function FormDataProvider({
	totalSteps,
	children,
}: {
	/** 총 단계 숫자 */
	totalSteps: number;
	/** 폼 컴포넌트 */
	children: React.ReactNode;
}) {
	const [isStepValid, setIsStepValid] = useState<boolean[]>(() => Array(totalSteps).fill(false));
	const [data, setData] = useState<MeetupCreateData>(initialData);

	const getStepValid = useCallback((step: number) => isStepValid[step - 1], [isStepValid]);

	const checkAllStepValid = useCallback(() => {
		return isStepValid.slice(0, totalSteps).every(Boolean);
	}, [isStepValid, totalSteps]);

	const setStepValid = useCallback((step: number, isValid: boolean) => {
		setIsStepValid((prev) => {
			const newValid = [...prev];
			newValid[step - 1] = isValid;
			return newValid;
		});
	}, []);

	// 모달이 닫히면 데이터, 유효성 초기화
	useEffect(() => {
		return () => {
			setIsStepValid(Array(totalSteps).fill(false));
			setData(initialData);
		};
	}, []);

	return (
		<FormDataContext.Provider
			value={{ getStepValid, checkAllStepValid, setStepValid, data, setData }}>
			{children}
		</FormDataContext.Provider>
	);
}
