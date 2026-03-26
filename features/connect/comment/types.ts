// 공통 타입
export interface Author {
	id: number;
	name: string;
	image?: string;
}

// API 타입 (서버 응답 그대로)
export interface CommentResponse {
	id: number;
	content: string;
	createdAt: string;
	author: Author;
	likeCount: number;
}

// 도메인 타입 (앱 내부에서 사용하는 형태)
export interface Comment {
	id: number;
	content: string;
	createdAt: string;
	author: Author;
	likes: number;
}

// UI 타입 (카드용 데이터)
export interface CommentCardItem {
	id: number;
	content: string;
	authorName: string;
	date: number;
}
// 컴포넌트 Props
export interface CommentCardProps extends CommentCardItem {
	isLiked?: boolean;
}
