// 공통 타입
export interface Author {
	id: number;
	name: string;
	image?: string;
}

// API
export interface Comment {
	id: number;
	content: string;
	createdAt: string;
	author: Author;
}

// UI 타입
export interface CommentCardItem {
	id: number;
	content: string;
	authorName: string;
	date: number;
}

// 컴포넌트 Props
export interface CommentCardProps extends CommentCardItem {
	authorId: number;
	currentUserId: number | null;
}
