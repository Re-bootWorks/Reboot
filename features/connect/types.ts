// 게시판 목록 타입
export type Post = {
	id: number;
	title: string;
	content: string;
	image: string;
	likeCount: number;
	createdAt: string;
	author: {
		name: string;
	};
	_count: {
		comments: number;
	};
};

// UI 타입 (PostCard용)
export type PostCardItem = {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	author: string;
	date: number;
	likeCount: number;
	commentCount: number;
};

// HOT 게시판용
export type GetPostsParams = {
	type?: "all" | "best"; // 전체 or 인기글
	sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount"; // 정렬 기준
	offset?: number; // 시작 위치
	limit?: number; // 가져올 개수
};
