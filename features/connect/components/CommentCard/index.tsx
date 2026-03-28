import type { CommentCardProps } from "@/features/connect/comment/types";
import { useEffect, useState } from "react";
import RelativeTime from "@/features/connect/ui/RelativeTime";

export default function CommentCard({ content, authorName, date }: CommentCardProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
			<div className="pt-[8px] pb-[24px] md:pt-[16px]">
				{/* 댓글 내용 */}
				<div className="pb-[8px] text-sm leading-[28px] font-normal tracking-[-0.36px] text-gray-700 md:pb-[6px] md:text-lg">
					{content}
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
