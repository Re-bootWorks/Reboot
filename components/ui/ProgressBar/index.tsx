"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./index.module.css";
import { cn } from "@/utils/cn";

interface ProgressBarProps {
	/** 최대 값 */
	max: number;
	/** 현재 값 */
	current: number;
	/** 최초 애니메이션 적용 여부 */
	hasAnimation?: boolean;
	/** 세부 스타일 설정 */
	className?: string;
}
export default function ProgressBar({
	max,
	current,
	hasAnimation = true,
	className = "w-full h-[5px]",
	...props
}: ProgressBarProps) {
	const isMounted = useRef(false);

	useLayoutEffect(() => {
		requestAnimationFrame(() => {
			isMounted.current = true;
		});
	}, []);

	const percent = max > 0 ? Math.min((current / max) * 100, 100) : 0;
	return (
		<div
			role="progressbar"
			aria-valuenow={current}
			aria-valuemax={max}
			className={cn("pointer-events-none overflow-hidden rounded-[10px] bg-gray-50", className)}
			{...props}>
			<div
				className={cn(
					"h-full [background-image:var(--gradient-purple-500)]",
					hasAnimation && styles.animated,
				)}
				style={{
					clipPath: `inset(0 ${100 - percent}% 0 0 round 10px)`,
					backgroundSize: `${percent}% 100%`,
					transform: "scaleX(1.005) scaleY(1.1)",
					transformOrigin: "left top",
					transition: isMounted.current ? "clip-path 0.3s ease, background-size 0.3s ease" : "none",
				}}
			/>
		</div>
	);
}
