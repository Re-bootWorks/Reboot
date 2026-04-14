"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../../../../utils/cn";

interface TypingTextProps {
	text: string;
	speed?: number;
	delay?: number;
	className?: string;
	wrapperClassName?: string;
	cursorClassName?: string;
	showCursor?: boolean;
}

export default function TypingText({
	text,
	speed = 80,
	delay = 0,
	className,
	wrapperClassName,
	cursorClassName,
	showCursor = false,
}: TypingTextProps) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let typingTimer: ReturnType<typeof setInterval> | undefined;

		const startTimer = setTimeout(() => {
			typingTimer = setInterval(() => {
				setCount((prev) => {
					if (prev >= text.length) {
						if (typingTimer) clearInterval(typingTimer);
						return prev;
					}
					return prev + 1;
				});
			}, speed);
		}, delay * 1000);

		return () => {
			clearTimeout(startTimer);
			if (typingTimer) clearInterval(typingTimer);
		};
	}, [text, speed, delay]);

	return (
		<span className={wrapperClassName}>
			<span className={cn("whitespace-nowrap", className)}>{text.slice(0, count)}</span>
			{showCursor && (
				<motion.span
					animate={{ opacity: [0, 1, 0] }}
					transition={{ duration: 0.8, repeat: Infinity }}
					className={`ml-px inline-block h-[0.9em] w-px bg-current align-[-0.08em] ${cursorClassName ?? ""}`}
				/>
			)}
		</span>
	);
}
