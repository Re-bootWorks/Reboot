"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MotionItemRightToLeftProps {
	children: ReactNode;
	className?: string;
}

export default function MotionItemRightToLeft({ children, className }: MotionItemRightToLeftProps) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, x: 24 },
				show: { opacity: 1, x: 0 },
			}}
			transition={{ duration: 0.5, ease: "easeOut" }}>
			{children}
		</motion.div>
	);
}
