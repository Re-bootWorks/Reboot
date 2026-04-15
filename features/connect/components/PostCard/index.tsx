import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import IcPerson from "@/components/ui/icons/IcPerson";
import dayjs from "@/libs/dayjs";
import Image from "next/image";
import EmptyImage from "@/features/connect/ui/EmptyImage";
import RelativeTime from "@/components/ui/RelativeTime";
import type { PostCardProps } from "@/features/connect/post/types";
import LoaderDots from "@/components/ui/LoaderDots";
import Skeleton from "react-loading-skeleton";

const containerStyle =
	"relative flex h-[19.375rem] w-full max-w-[18.5rem] flex-col rounded-xl overflow-hidden bg-white sm:h-[12.5rem] sm:max-w-[40.25rem] sm:flex-row md:max-w-[76rem]";

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
		<div
			onClick={onClick}
			className="relative flex h-[19.375rem] w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white transition hover:bg-gray-50 sm:h-[12.5rem] sm:max-w-[40.25rem] sm:flex-row md:max-w-[76rem]">
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
			<div className="relative order-2 h-[9rem] w-full shrink-0 overflow-hidden rounded-xl sm:order-1 sm:h-full sm:w-[12.5rem]">
				{imageUrl ? (
					<Image src={imageUrl} alt={title} fill className="object-cover" />
				) : (
					<EmptyImage />
				)}
			</div>

			{/* 텍스트 영역 */}
			<div className="order-3 flex flex-1 flex-col px-4 sm:order-2 sm:px-6">
				<div className="flex flex-col gap-1">
					<h3 className="hidden pt-4 text-base font-semibold text-gray-900 sm:block">{title}</h3>
					<p className="line-clamp-2 pt-2 text-sm text-gray-600">{description}</p>
				</div>

				{/* 하단 메타 정보*/}
				<div className="mt-auto border-b border-gray-200 pb-6 text-xs leading-4 font-normal text-gray-500">
					<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
						{/* 유저정보 */}
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								{author.image ? (
									<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
										<Image src={author.image} alt={author.name} fill className="object-cover" />
									</div>
								) : (
									<IcPerson color="gray-400" size={24} />
								)}
								<span className="text-sm font-medium text-gray-700">{author.name}</span>
							</div>
						</div>

						{/* 메타정보 */}
						<div className="flex items-center justify-end gap-2 sm:justify-normal">
							<span>{dayjs(date).format("YYYY.MM.DD")}</span>
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
		</div>
	);
}

ConnectCard.Skeleton = ConnectCardSkeleton;
