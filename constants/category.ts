import type { StaticImageData } from "next/image";
import type { CategoryName } from "@/store/category.store";
import imgGrowth from "@/public/assets/img/img_meetup_growth.svg";
import imgFitness from "@/public/assets/img/img_meetup_fitness.svg";
import imgCulture from "@/public/assets/img/img_meetup_culture.svg";
import imgTravel from "@/public/assets/img/img_meetup_travel.svg";
import imgPets from "@/public/assets/img/img_meetup_pets.svg";
import imgVibes from "@/public/assets/img/img_meetup_vibes.svg";

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

export const categoryDisplayTitles = {
	자기계발: "자기 계발",
	"운동/스포츠": "운동 • 스포츠",
	문화생활: "문화생활",
	여행: "여행",
	반려동물: "반려동물",
	기타: "기타",
} satisfies Record<CategoryName, string>;

export const categoryTags = {
	자기계발: ["#역량향상", "#취업성공"],
	"운동/스포츠": ["#체력관리", "#다이어트"],
	문화생활: ["#감성충전", "#덕질친구"],
	여행: ["#일상탈출", "#맛집투어"],
	반려동물: ["#산책친구", "#자랑대회"],
	기타: ["#일상공유", "#봉사활동"],
} satisfies Record<CategoryName, string[]>;
