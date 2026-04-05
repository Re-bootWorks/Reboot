// 공통 타입
export interface Author {
	id: number;
	name: string;
	image?: string;
}

// API
export interface Comment {
	id: number;
	teamId: string;
	postId: number;
	authorId: number;

	content: string;
	createdAt: string;
	updatedAt: string;

	author: Author;
}
// UI 타입
export interface CommentCardItem {
	id: number;
	content: string;
	authorName: string;
	authorImage?: string;
	date: number;
}

// 컴포넌트 Props
export interface CommentCardProps extends CommentCardItem {
	postId: number;
	authorId: number;
	currentUserId: number | null;
	isPending?: boolean;
}

export interface GetCommentsParams {
	postId: number;
	cursor?: string;
	size?: number;
}

export interface GetCommentsResponse {
	data: Comment[];
	nextCursor: string | null;
	hasMore: boolean;
}

// 유저 공개 프로필
export interface UserProfile {
	id: number;
	teamId: string;
	email: string;
	name: string;
	companyName?: string;
	image?: string | null;
}
