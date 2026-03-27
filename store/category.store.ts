"use client";

import { create } from "zustand";

export type CategoryName = "자기계발" | "운동/스포츠" | "문화생활" | "여행" | "반려동물" | "기타";

export interface Category {
	id: number;
	name: CategoryName;
	description: string;
}

const INIT_DATA: Category[] = [
	{
		id: 266,
		name: "자기계발",
		description: "게임, 만화, 공예, 코딩, 라떼 아트, 외국어, 베이킹, 악기, 조향 등의 모임입니다.",
	},
	{
		id: 267,
		name: "운동/스포츠",
		description: "자전거, 런닝, 야구, 클라이밍, 방송댄스, 테니스 등의 모임입니다.",
	},
	{
		id: 268,
		name: "문화생활",
		description: "뮤지컬, 연극, 오페라, 박람회, 미술관, 역사관, 수족관, 전시회 등의 모임입니다.",
	},
	{
		id: 269,
		name: "여행",
		description: "국내외 여행 모임입니다.",
	},
	{
		id: 270,
		name: "반려동물",
		description: "반려동물 산책 / 애견 카페 등의 모임입니다.",
	},
	{
		id: 271,
		name: "기타",
		description: "그외 기타 모임입니다.",
	},
];

interface CategoryStore {
	categories: Category[];
	set: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
	categories: INIT_DATA,
	set: (categories: Category[]) => set({ categories }),
}));
