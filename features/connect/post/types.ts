// 게시판 목록 타입
export type Post = {
	id: number;
	title: string;
	content: string;
	image: string;
	imageUrl?: string;
	likeCount: number;
	createdAt: string;
	author: {
		name: string;
	};
	_count: {
		comments: number;
	};
};

export type PostComment = {
	id: number;
	content: string;
	createdAt: string;
	author: {
		id: number;
		name: string;
		image?: string;
	};
};

// Connect 상세용 (Post 확장)
export type ConnectPost = Post & {
	teamId: string;
	authorId: number;
	viewCount: number;
	isLiked: boolean;
	updatedAt: string;
	author: {
		id: number;
		name: string;
		image?: string;
		email?: string;
	};
	comments: PostComment[];
};
// UI 타입 (PostCard용)
export type PostCardItem = {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	author: string;
	date: number;
	likeCount: number;
	isLiked?: boolean;
	commentCount: number;
};

// UI 컴포넌트 Props 타입
export type PostCardProps = PostCardItem & {
	onClick?: () => void;
	onLikeClick?: (e: React.MouseEvent) => void;
	isLoading?: boolean;
};

// HOT 게시판용
export type GetPostsParams = {
	type?: "all" | "best"; // 전체 or 인기글
	sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount"; // 정렬 기준
	offset?: number; // 시작 위치
	limit?: number; // 가져올 개수
	keyword?: string;
};

// 게시글 목록 응답 타입
export type GetPostsResponse = {
	data: Post[];
	nextCursor?: string;
	hasMore?: boolean;
	totalCount?: number;
	currentOffset?: number;
	limit?: number;
};
