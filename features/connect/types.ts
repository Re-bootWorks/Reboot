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
