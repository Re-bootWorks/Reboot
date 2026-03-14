import { cn } from "@/utils/cn";
import styles from "./index.module.css";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface CategoryTabProps {
	/** 카테고리 이미지 경로 또는 `StaticImport` */
	imageSrc: string | StaticImport;
	/** 카테고리 이름 */
	name: string;
}
export default function CategoryTab({ imageSrc, name, ...props }: CategoryTabProps) {
	return (
		<div
			className={cn(
				"group relative",
				"flex flex-col items-center justify-center gap-y-2.5",
				"h-[136px] w-[136px] cursor-pointer rounded-2xl",
				"border border-transparent",
				"bg-gray-50 hover:bg-purple-100",
			)}
			{...props}>
			{/* border gradient transition */}
			<div
				className={cn(
					"absolute inset-0 rounded-2xl",
					"border border-transparent",
					"opacity-0 transition-opacity duration-300 ease-in-out",
					"group-hover:opacity-100",
					styles.cardBorderGlow, // border 그라데이션
				)}
			/>
			<Image src={imageSrc} alt={name} width={80} height={80} className="relative" />
			<span className="relative text-sm text-gray-800">{name}</span>
		</div>
	);
}
