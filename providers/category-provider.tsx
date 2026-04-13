"use client";
import { useEffect, useRef } from "react";
import { MeetingTypeResponse } from "@/apis/meetingTypes";
import { useCategoryStore, type Category } from "@/store/category.store";

export default function CategoryInitializer({ data }: { data: MeetingTypeResponse | null }) {
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		if (data?.length) {
			const categories = generateCategories(data);
			if (categories?.length) useCategoryStore.getState().set(categories);
		}
	}, []);

	return null;
}

function generateCategories(data: MeetingTypeResponse): Category[] {
	return data.map(({ id, name, description }) => ({ id, name, description }));
}
