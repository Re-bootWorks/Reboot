"use client";
import { useEffect, useRef } from "react";
import { CategoryName, useCategoryStore, type Category } from "@/store/category.store";
import { MeetingTypeResponse } from "@/apis/meetingTypes";
import type { StaticImageData } from "next/image";
import imgGrowth from "@/public/assets/img/img_meetup_growth.svg";
import imgFitness from "@/public/assets/img/img_meetup_fitness.svg";
import imgCulture from "@/public/assets/img/img_meetup_culture.svg";
import imgTravel from "@/public/assets/img/img_meetup_travel.svg";
import imgPets from "@/public/assets/img/img_meetup_pets.svg";
import imgVibes from "@/public/assets/img/img_meetup_vibes.svg";

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

export const categoryImages = {
	자기계발: imgGrowth,
	"운동/스포츠": imgFitness,
	문화생활: imgCulture,
	여행: imgTravel,
	반려동물: imgPets,
	기타: imgVibes,
} satisfies Record<CategoryName, StaticImageData>;

export const categorySubTitles = {
	자기계발: "growth",
	"운동/스포츠": "sports",
	문화생활: "culture",
	여행: "travel",
	반려동물: "pets",
	기타: "vibes",
} satisfies Record<CategoryName, string>;

export const categoryDefaultColors = {
	자기계발: "#DCDAF9", // --color-purple-100
	"운동/스포츠": "#CFF0E4", // --color-green-100
	문화생활: "#FCE7F3",
	여행: "#E0F2FE",
	반려동물: "#FEF3C7",
	기타: "#F1F5F9",
} satisfies Record<CategoryName, string>;

export const categoryLightColors = {
	자기계발: "#F0EFFC", // --color-purple-50
	"운동/스포츠": "#E6F7F1", // --color-green-50
	문화생활: "#FDF2F8",
	여행: "#F0F9FF",
	반려동물: "#FFFBEB",
	기타: "#F8FAFC",
} satisfies Record<CategoryName, string>;

export const categoryDarkColors = {
	자기계발: "#604CDE", // --color-purple-600
	"운동/스포츠": "#0B7955", // --color-green-600
	문화생활: "#BE185D",
	여행: "#0369A1",
	반려동물: "#B45309", // --color-orange-500
	기타: "#334155",
} satisfies Record<CategoryName, string>;
