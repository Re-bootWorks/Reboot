import { cn } from "@/utils/cn";
import styles from "./style.module.css";
import Image, { type StaticImageData } from "next/image";
import type { CategoryName } from "@/store/category.store";

interface CategoryTabProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** 카테고리 이미지 경로 또는 정적 import 결과 */
	imageSrc: string | StaticImageData;
	/** 카테고리 이름 */
	title: string;
	/** radio 필드명 */
	name: string;
	/** radio 선택값 (category.name) */
	value: CategoryName;
}
export default function CategoryTab({ imageSrc, name, value, title, ...props }: CategoryTabProps) {
	const tabVars = {
		"--category-tab-light": categoryLightColors[value],
		"--category-tab-default": categoryDefaultColors[value],
		"--category-tab-accent": categoryDarkColors[value],
	} as React.CSSProperties;

	return (
		<label
			className={cn(
				"group relative select-none",
				"flex flex-col items-center justify-center gap-y-2.5",
				"h-[173px] min-h-0 w-[136px] min-w-0 cursor-pointer rounded-2xl py-1.5",
				"bg-gray-50",
			)}
			style={tabVars}>
			<input type="radio" name={name} value={value} className="sr-only" {...props} />
			<div
				className={cn(
					"absolute inset-0 rounded-2xl",
					"border border-transparent",
					"opacity-0 transition-opacity duration-300 ease-in-out",
					"group-hover:opacity-100",
					"group-has-checked:opacity-100",
					styles.borderGlow,
				)}
				aria-hidden="true"
			/>
			<Image
				src={imageSrc}
				alt={title}
				width={80}
				height={80}
				className="relative"
				draggable={false}
			/>
			<span className="relative text-sm text-gray-800">{title}</span>
			<span
				className={cn("z-1 rounded-full border p-1 px-3 py-1 text-xs uppercase", styles.subTitle)}>
				{categorySubTitles[value]}
			</span>
		</label>
	);
}

const categorySubTitles = {
	자기계발: "growth",
	"운동/스포츠": "sports",
	문화생활: "culture",
	여행: "travel",
	반려동물: "pets",
	기타: "vibes",
} satisfies Record<CategoryName, string>;

const categoryLightColors = {
	자기계발: "#F0EFFC", // --color-purple-50
	"운동/스포츠": "#E6F7F1", // --color-green-50
	문화생활: "#FDF2F8",
	여행: "#F0F9FF",
	반려동물: "#FFFBEB",
	기타: "#F8FAFC",
} satisfies Record<CategoryName, string>;

const categoryDefaultColors = {
	자기계발: "#DCDAF9", // --color-purple-100
	"운동/스포츠": "#CFF0E4", // --color-green-100
	문화생활: "#FCE7F3",
	여행: "#E0F2FE",
	반려동물: "#FEF3C7",
	기타: "#F1F5F9",
} satisfies Record<CategoryName, string>;

const categoryDarkColors = {
	자기계발: "#604CDE", // --color-purple-600
	"운동/스포츠": "#0B7955", // --color-green-600
	문화생활: "#BE185D",
	여행: "#0369A1",
	반려동물: "#B45309", // --color-orange-500
	기타: "#334155",
} satisfies Record<CategoryName, string>;
