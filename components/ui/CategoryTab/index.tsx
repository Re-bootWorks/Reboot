import { cn } from "@/utils/cn";
import styles from "./style.module.css";
import Image, { type StaticImageData } from "next/image";
import type { CategoryName } from "@/store/category.store";
import {
	categorySubTitles,
	categoryDefaultColors,
	categoryDarkColors,
	categoryLightColors,
} from "@/constants/category";

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
				"flex flex-col items-center justify-center gap-y-1 md:gap-y-2.5",
				"h-full min-h-0 w-full min-w-0 cursor-pointer rounded-2xl py-2.5",
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
				className="relative size-[50px] md:size-20"
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
