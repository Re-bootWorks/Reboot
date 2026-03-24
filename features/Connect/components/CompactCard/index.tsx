import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import EmptyImage from "@/features/connect/ui/EmptyImage";
import dayjs from "@/libs/dayjs";

type CompactCardProps = {
	id: number;
	title: string;
	image: string;
	createdAt: string;
	likeCount: number;
	commentCount: number;
	onClick?: () => void;
};

export default function CompactCard({
	title,
	image,
	createdAt,
	likeCount,
	commentCount,
	onClick,
}: CompactCardProps) {
	return (
		// 카드 컨테이너
		<div
			onClick={onClick}
			className="flex h-[13.875rem] w-[10.125rem] shrink-0 cursor-pointer flex-col transition duration-300 ease-out hover:-translate-y-0.5 md:h-[15.75rem] md:w-[18.875rem]">
			{/* 이미지 영역 */}
			<div className="h-[11.25rem] overflow-hidden rounded-[1.5rem]">
				{image?.trim() ? (
					<img src={image} alt={title} className="h-full w-full object-cover" />
				) : (
					<EmptyImage size="md" />
				)}
			</div>

			{/* 텍스트 영역 */}
			<div className="mt-3.5 flex flex-1 flex-col px-1">
				{/* 제목 */}
				<h3 className="line-clamp-2 text-base font-semibold text-gray-900">{title}</h3>

				{/* 메타 정보 영역 */}
				<div className="mt-[0.25rem] flex items-center gap-3 text-xs text-gray-500">
					{/* 작성일 */}
					<span>{dayjs(createdAt).fromNow()}</span>

					{/* 좋아요 */}
					<div className="flex items-center gap-1">
						<IcThumbOutline size={14} />
						<span>{likeCount}</span>
					</div>

					{/* 댓글 */}
					<div className="flex items-center gap-1">
						<IcMessageOutline size={14} />
						<span>{commentCount}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
