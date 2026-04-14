"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MotionFadeLeftToRightProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

export default function MotionFadeLeftToRight({
	children,
	delay = 0,
	className,
}: MotionFadeLeftToRightProps) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, x: -32 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, delay, ease: "easeOut" }}>
			{children}
		</motion.div>
	);
}
