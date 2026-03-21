export interface PageIntroContent {
	title: string;
	description: string;
	imageSrc?: string;
	imageAlt?: string;
}

export const PAGE_INTRO_CONTENTS: Record<string, PageIntroContent> = {
	favorites: {
		title: "찜한 모임",
		description: "눈길이 갔던 모임 이제 직접 경험해봐요 ✨",
		imageSrc: "/assets/img/img_favorite.svg",
		imageAlt: "찜한 모임 페이지 대표 이미지",
	},
	reviews: {
		title: "모든 리뷰",
		description: "Re:boot 이용자들은 이렇게 느꼈어요 🫶",
		imageSrc: "/assets/img/img_review.svg",
		imageAlt: "모든 리뷰 페이지 대표 이미지",
	},
	posts: {
		title: "커넥트",
		description: "Re:boot에서 여러분의 이야기를 들려주세요 💬",
		imageSrc: "/assets/img/img_talk.svg",
		imageAlt: "커넥트 페이지 대표 이미지",
	},
};
