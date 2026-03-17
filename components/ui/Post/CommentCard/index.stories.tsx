export interface Author {
	id: number;
	name: string;
	image?: string;
}

export interface BaseComment {
	id: number;
	author: Author;
	content: string;
	createdAt: string;
}

export interface CommentCardProps extends BaseComment {
	likes?: number;
	isLiked?: boolean;
	repliesCount?: number;
}

export default function CommentCard({
	author,
	content,
	createdAt,
	likes = 0,
	isLiked = false,
	repliesCount = 0,
}: CommentCardProps) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="h-6 w-6 rounded-full bg-gray-300" />
					<span className="text-sm font-medium">{author.name}</span>
				</div>
				<span className="text-xs text-gray-500">{createdAt}</span>
			</div>

			<div className="text-sm text-gray-700">{content}</div>

			<div className="flex items-center gap-3 text-xs text-gray-500">
				<span>좋아요{likes}</span>
				<span>답글 {repliesCount}</span>
			</div>
		</div>
	);
}
