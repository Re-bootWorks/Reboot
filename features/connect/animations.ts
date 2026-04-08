// 게시글/카드 목록 등장 애니메이션 (stagger 적용)
export const cardVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
	}),
	exit: { opacity: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// 댓글 목록 등장/퇴장 애니메이션 (stagger 적용)
export const commentVariants = {
	hidden: { opacity: 0, y: 6 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" as const },
	}),
	exit: { opacity: 0, y: -4, transition: { duration: 0.2, ease: "easeOut" as const } },
};

// 댓글 수정 폼 전환 애니메이션 (보기 <-> 수정 모드)
export const commentEditVariants = {
	view: {
		hidden: { opacity: 0, y: 4 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
		exit: { opacity: 0, y: 4, transition: { duration: 0.15, ease: "easeIn" as const } },
	},
	edit: {
		hidden: { opacity: 0, y: -4 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
		exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" as const } },
	},
};

// 게시글 상세 카드 등장 애니메이션
export const postDetailVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// 게시글 상세 이미지 등장 애니메이션
export const postDetailImageVariants = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

// 좋아요 숫자 변경 애니메이션
export const likeCountVariants = {
	hidden: { opacity: 0, y: 6 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};
