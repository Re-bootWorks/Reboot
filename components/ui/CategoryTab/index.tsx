import { cn } from "@/utils/cn";
import styles from "./style.module.css";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface CategoryTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 카테고리 이미지 경로 또는 `StaticImport` */
	imageSrc: string | StaticImport;
	/** 카테고리 이름 */
	name: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function CategoryTab({ imageSrc, name, onClick, ...props }: CategoryTabProps) {
	return (
		<button
			className={cn(
				"group relative",
				"flex flex-col items-center justify-center gap-y-2.5",
				"h-[136px] w-[136px] cursor-pointer rounded-2xl",
				"bg-gray-50 hover:bg-purple-100",
			)}
			onClick={onClick}
			{...props}>
			<div
				className={cn(
					"absolute inset-0 rounded-2xl",
					"border border-transparent",
					"opacity-0 transition-opacity duration-300 ease-in-out",
					"group-hover:opacity-100",
					styles.borderGlow, // 그라데이션 border
				)}
			/>
			<Image src={imageSrc} alt={name} width={80} height={80} className="relative" />
			<span className="relative text-sm text-gray-800">{name}</span>
		</button>
	);
}
