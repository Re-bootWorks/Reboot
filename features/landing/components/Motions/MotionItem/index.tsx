"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MotionItemProps {
	children: ReactNode;
	className?: string;
}

export function MotionItem({ children, className }: MotionItemProps) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, y: 24 },
				show: { opacity: 1, y: 0 },
			}}
			transition={{ duration: 0.5, ease: "easeOut" }}>
			{children}
		</motion.div>
	);
}
