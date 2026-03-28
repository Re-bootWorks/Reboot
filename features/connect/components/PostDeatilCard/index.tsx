"use client";

import Image from "next/image";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import dayjs from "@/libs/dayjs";

interface Props {
	title: string;
	content: string;
	imageUrl: string;
	author: string;
	createdAt: string;
	likeCount: number;
	commentCount: number;
	date: number;
}

function getTimeAgo(timestamp: number) {
	return dayjs(timestamp).fromNow();
}

export default function PostDeatilCard({
	title,
	content,
	imageUrl,
	author,
	createdAt,
	likeCount,
	commentCount,
	date,
}: Props) {
	return (
		<div className="w-full rounded-[48px] bg-white px-6 pt-6 pb-5 md:px-10 md:pt-10 md:pb-9 lg:px-16 lg:pt-16 lg:pb-14">
			{/* 제목 */}
			<div className="flex items-start justify-between">
				<h1 className="text-[20px] leading-[30px] font-bold tracking-[-0.4px] md:text-3xl md:leading-[2.25rem]">
					{title}
				</h1>
				<ActionDropdown
					items={[
						{
							label: "수정하기",
							onClick: () => console.log("edit"),
						},
						{
							label: "삭제하기",
							onClick: () => console.log("delete"),
							danger: true,
						},
					]}
				/>
			</div>
			{/* 작성자 */}
			<div className="mt-3 flex items-center gap-2 text-sm text-gray-500 md:mt-5">
				<img src="/assets/img/img_profile.svg" alt="profile" className="h-4 w-4" />
				<span>
					{author} {createdAt}
				</span>
			</div>
			{/* 내용 */}
			<div
				className="mt-6 min-h-[140px] text-base leading-6 tracking-[-0.32px] text-gray-700 md:mt-10"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			{/* 이미지 */}
			{imageUrl && (
				<div className="mt-8">
					<div className="relative h-[200px] w-[200px] overflow-hidden rounded-3xl">
						<Image src={imageUrl} alt="post image" fill className="object-cover" />
					</div>
				</div>
			)}
			{/* 하단 정보 */}
			<div className="mt-10 flex items-center gap-2 text-sm tracking-[-0.28px] text-gray-500 md:mt-12">
				<span>{getTimeAgo(date)}</span>

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
	);
}
