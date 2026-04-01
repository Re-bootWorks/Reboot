export const cardVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
	}),
	exit: { opacity: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};
