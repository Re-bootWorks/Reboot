export const sectionVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: "easeOut" as const,
		},
	},
};

export const slideFromLeftVariants = {
	hidden: { opacity: 0, x: -30 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.5, ease: "easeOut" as const },
	},
};

export const slideFromRightVariants = {
	hidden: { opacity: 0, x: 30 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.5, ease: "easeOut" as const },
	},
};
