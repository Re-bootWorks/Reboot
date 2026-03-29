import type { CommentCardProps } from "@/features/connect/comment/types";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";

export default function CommentCard({
	content,
	authorName,
	date,
	authorId,
	currentUserId,
}: CommentCardProps) {
	const isMine = authorId === currentUserId;

	const handleEdit = () => {
		console.log("수정");
	};

	const handleDelete = () => {
		console.log("삭제");
	};

	return (
		<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
			<div className="pt-[8px] pb-[24px] md:pt-[16px]">
				{/* 댓글 내용 */}
				<div className="flex items-start justify-between pb-[8px]">
					<div className="text-sm leading-[28px] font-normal tracking-[-0.36px] text-gray-700 md:text-lg">
						{content}
					</div>
					{isMine && (
						<ActionDropdown
							items={[
								{ label: "수정하기", onClick: handleEdit },
								{ label: "삭제하기", onClick: handleDelete, danger: true },
							]}
						/>
					)}
				</div>

				{/* 댓글 메타 영역 */}
				<div className="flex items-center gap-2 text-xs text-gray-500">
					<span>{authorName}</span>
					<span>·</span>
					<RelativeTime date={date} fallback="date" />
				</div>
			</div>
		</div>
	);
}
