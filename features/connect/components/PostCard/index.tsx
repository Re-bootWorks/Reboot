import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import IcPerson from "@/components/ui/icons/IcPerson";
import dayjs from "@/libs/dayjs";
import Image from "next/image";
import EmptyImage from "@/features/connect/ui/EmptyImage";
import RelativeTime from "@/features/connect/ui/RelativeTime";
import type { PostCardProps } from "@/features/connect/post/types";
import LoaderDots from "@/components/ui/LoaderDots";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const containerStyle =
	"relative flex h-[19.375rem] w-full max-w-[18.4375rem] flex-col rounded-xl overflow-hidden bg-white sm:h-[12.5rem] sm:max-w-[40.25rem] sm:flex-row md:max-w-[76rem]";

function ConnectCardSkeleton() {
	return (
		<div className={containerStyle}>
			<Skeleton
				height="100%"
				containerClassName="block h-full w-full leading-none"
				borderRadius={0}
			/>
		</div>
	);
}

export default function ConnectCard({
	title,
	description,
	imageUrl,
	author,
	date,
	likeCount,
	commentCount,
	onClick,
	isLoading = false,
}: PostCardProps) {
	return (
		/* 카드 전체 */
		<div
			onClick={onClick}
			className="relative flex h-[19.375rem] w-full max-w-[18.4375rem] cursor-pointer flex-col rounded-xl bg-white transition hover:bg-gray-50 sm:h-[12.5rem] sm:max-w-[40.25rem] sm:flex-row md:max-w-[76rem]">
			{/* 로딩 오버레이 */}
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60">
					<LoaderDots size="sm" />
				</div>
			)}
			{/* 모바일 제목 */}
			<h3 className="truncate pt-2 pb-3 text-base leading-6 font-bold tracking-[-0.02em] text-gray-900 sm:hidden">
				{title}
			</h3>

			{/* 썸네일 이미지 */}
			<div className="relative order-2 h-[9rem] w-[18.375rem] shrink-0 overflow-hidden rounded-xl sm:order-1 sm:h-full sm:w-[12.5rem]">
				{imageUrl ? (
					<Image src={imageUrl} alt={title} fill className="object-cover" />
				) : (
					<EmptyImage />
				)}
			</div>

			{/* 텍스트 영역 */}
			<div className="order-3 flex flex-1 flex-col px-4 sm:order-2 sm:px-6">
				{/* 제목 + 내용 */}
				<div className="flex flex-col gap-1">
					{/* 데스크탑 제목 */}
					<h3 className="hidden pt-4 text-base font-semibold text-gray-900 sm:block">{title}</h3>

					{/* 설명 */}
					<p className="line-clamp-2 pt-2 text-sm text-gray-600">{description}</p>
				</div>

				{/* 하단 메타 정보 */}
				<div className="mt-auto flex items-center justify-between pb-6 text-xs leading-4 font-normal text-gray-500 sm:pb-6">
					{/* 작성자 + 날짜 */}
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<IcPerson color="gray-400" />
							<span>{author}</span>
						</div>
						<span>{dayjs(date).format("YYYY.MM.DD")}</span>
					</div>

					{/* 시간 + 좋아요 + 댓글 */}
					<div className="flex items-center gap-2">
						<RelativeTime date={date} />

						<div className="flex items-center gap-1">
							<IcThumbOutline color="gray-400" />
							<span>{likeCount}</span>
						</div>

						<div className="flex items-center gap-1">
							<IcMessageOutline color="gray-400" />
							<span>{commentCount}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

ConnectCard.Skeleton = ConnectCardSkeleton;
