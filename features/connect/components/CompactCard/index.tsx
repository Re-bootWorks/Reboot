import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import EmptyImage from "@/features/connect/ui/EmptyImage";
import dayjs from "@/libs/dayjs";
import Skeleton from "react-loading-skeleton";
import type { CompactCardItem } from "@/features/connect/post/types";

const containerStyle =
	"flex h-[13.875rem] w-[10.125rem] shrink-0 flex-col overflow-hidden md:h-[15.75rem] md:w-[18.725rem]";

function CompactCardSkeleton() {
	return (
		<div className={containerStyle}>
			<Skeleton
				height="100%"
				containerClassName="block h-full w-full leading-none"
				borderRadius={24}
			/>
		</div>
	);
}

export default function CompactCard({
	title,
	image,
	createdAt,
	likeCount,
	commentCount,
	onClick,
}: CompactCardItem) {
	return (
		<div
			onClick={onClick}
			className="relative h-[13.875rem] w-[10.125rem] shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg md:h-[15.75rem] md:w-[19rem]">
			{/* 이미지 */}
			<div className="absolute inset-0">
				{image?.trim() ? (
					<img src={image} alt={title} className="h-full w-full object-cover" />
				) : (
					<EmptyImage size="md" />
				)}
			</div>
			{/* 텍스트 */}
			<div className="absolute right-0 bottom-0 left-0 p-4">
				{/* 날짜 */}
				<span className="text-[11px] font-medium text-white/70">
					{dayjs(createdAt).format("YYYY.MM.DD")}
				</span>

				{/* 제목 */}
				<h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold text-white md:text-base">
					{title}
				</h3>

				{/* 좋아요 + 댓글 */}
				<div className="mt-2 flex items-center gap-3 text-xs text-white/80">
					<div className="flex items-center gap-1">
						<IcThumbOutline size={13} color="white" />
						<span>{likeCount}</span>
					</div>
					<div className="flex items-center gap-1">
						<IcMessageOutline size={13} color="white" />
						<span>{commentCount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

CompactCard.Skeleton = CompactCardSkeleton;
