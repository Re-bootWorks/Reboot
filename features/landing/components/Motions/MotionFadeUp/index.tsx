"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MotionFadeUpProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

export default function MotionFadeUp({ children, delay = 0, className }: MotionFadeUpProps) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, delay, ease: "easeOut" }}>
			{children}
		</motion.div>
	);
}
