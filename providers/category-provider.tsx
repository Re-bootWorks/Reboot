"use client";
import { useEffect, useRef } from "react";
import { useCategoryStore, type Category } from "@/store/category.store";
import { MeetingTypeResponse } from "@/apis/meetingTypes";

export default function CategoryInitializer({ data }: { data: MeetingTypeResponse | null }) {
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		if (data) {
			const categories = generateCategories(data);
			useCategoryStore.getState().set(categories);
		}
	}, []);

	return null;
}

function generateCategories(data: MeetingTypeResponse): Category[] {
	return data.map(({ id, name, description }) => ({ id, name, description }));
}
