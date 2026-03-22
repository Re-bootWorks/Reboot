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
		<div className="flex min-h-[96px] w-full max-w-[860px] flex-col gap-2 rounded-lg border">
			<div className="pt-[16px] pb-[24px]">
				{/* 댓글 내용 */}
				<div className="pb-[8px] text-lg leading-[28px] font-normal tracking-[-0.36px] text-gray-700">
					{content}
				</div>

				{/* 댓글 메타 영역 (작성자 + 시간) */}
				<div className="flex items-center gap-2 text-xs text-gray-500">
					<span>{author.name}</span>
					<span>·</span>
					<span>{createdAt}</span>
				</div>
			</div>
		</div>
	);
}
