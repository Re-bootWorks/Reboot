"use client";

import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { createContext, useContext, useState, useEffect } from "react";

interface EditFormDataContextValue {
	data: MeetupEditData;
	setData: React.Dispatch<React.SetStateAction<MeetupEditData>>;
}

const EditFormDataContext = createContext<EditFormDataContextValue | null>(null);

export function useEditFormData() {
	const ctx = useContext(EditFormDataContext);

	if (!ctx) {
		throw new Error("useEditFormData는 EditFormDataProvider 안에서만 사용 가능합니다.");
	}
	return ctx;
}

interface EditFormDataProviderProps {
	isOpen: boolean;
	initialData: MeetupEditData;
	children: React.ReactNode;
}

export default function EditFormDataProvider({
	isOpen,
	initialData,
	children,
}: EditFormDataProviderProps) {
	const [data, setData] = useState<MeetupEditData>(initialData);

	// 모달이 닫히면 기존 모임 데이터로 초기화
	useEffect(() => {
		if (!isOpen) {
			setData(initialData);
		}
	}, [isOpen, initialData]);

	return (
		<EditFormDataContext.Provider value={{ data, setData }}>
			{children}
		</EditFormDataContext.Provider>
	);
}
