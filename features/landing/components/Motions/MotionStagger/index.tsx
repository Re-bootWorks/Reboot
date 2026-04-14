"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface MotionStaggerProps {
	children: ReactNode;
	className?: string;
}

export default function MotionStagger({ children, className }: MotionStaggerProps) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: {},
				show: {
					transition: {
						staggerChildren: 0.12,
					},
				},
			}}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.15 }}>
			{children}
		</motion.div>
	);
}
