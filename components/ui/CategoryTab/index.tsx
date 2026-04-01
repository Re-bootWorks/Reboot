import { cn } from "@/utils/cn";
import styles from "./style.module.css";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface CategoryTabProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** 카테고리 이미지 경로 또는 `StaticImport` */
	imageSrc: string | StaticImport;
	/** 카테고리 이름 */
	title: string;
	/** radio 필드명 */
	name: string;
	/** radio 선택값 */
	value: string | number;
}
export default function CategoryTab({ imageSrc, name, value, title, ...props }: CategoryTabProps) {
	return (
		<label
			className={cn(
				"group relative select-none",
				"flex flex-col items-center justify-center gap-y-2.5",
				"h-[136px] w-[136px] cursor-pointer rounded-2xl",
				"bg-gray-50 hover:bg-purple-100",
			)}>
			<input type="radio" name={name} value={value} className="sr-only" {...props} />
			<div
				className={cn(
					"absolute inset-0 rounded-2xl",
					"border border-transparent",
					"opacity-0 transition-opacity duration-300 ease-in-out",
					"group-hover:opacity-100",
					"group-has-checked:opacity-100",
					styles.borderGlow, // 그라데이션 border
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
		</label>
	);
}
