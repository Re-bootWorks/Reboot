"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MeetupCreateRequest } from "../../types";
import { createSessionStore } from "../utils";

interface FormDataContextValue {
	/** 단계 유효성 조회 */
	getStepValid: (step: number) => boolean;
	/** 모든 단계 유효성 조회 */
	checkAllStepValid: () => boolean;
	/** 단계 유효성 설정 */
	setStepValid: (step: number, isValid: boolean) => void;
	/** 데이터 조회 */
	data: MeetupCreateFormData;
	/** 데이터 설정 */
	setData: React.Dispatch<React.SetStateAction<MeetupCreateFormData>>;
}

const FormDataContext = createContext<FormDataContextValue | null>(null);

export function useFormData() {
	const ctx = useContext(FormDataContext);
	if (!ctx) {
		throw new Error("useFormData는 FormDataProvider 안에서만 사용할 수 있습니다");
	}
	return ctx;
}

export interface MeetupCreateFormData extends MeetupCreateRequest {
	_dateTime: { date: string; time: string };
	_registrationEnd: { date: string; time: string };
	_addressName: string;
	_addressDetail: string;
}

const initialData: MeetupCreateFormData = {
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
	_dateTime: { date: "", time: "" },
	_registrationEnd: { date: "", time: "" },
	_addressName: "",
	_addressDetail: "",
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
	const [data, setData] = useState<MeetupCreateFormData>(initialData);
	const isInitialMount = useRef(true);

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

	// 세션 복원
	useEffect(() => {
		const stored = createSessionStore.get();
		if (stored && typeof stored === "object") {
			setData({ ...initialData, ...stored } as MeetupCreateFormData);
		}
	}, []);

	// 세션 실시간 저장(최초 mount 시점 외)
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		createSessionStore.set(data);
	}, [data]);

	return (
		<FormDataContext.Provider
			value={{ getStepValid, checkAllStepValid, setStepValid, data, setData }}>
			{children}
		</FormDataContext.Provider>
	);
}
