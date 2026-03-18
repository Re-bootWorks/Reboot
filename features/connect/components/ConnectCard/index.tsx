import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";
import IcPerson from "@/components/ui/icons/IcPerson";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

type ConnectCardProps = {
	title: string;
	description: string;
	imageUrl: string;
	author: string;
	date: number;
	likeCount: number;
	commentCount: number;
	onClick?: () => void;
};

function formatDate(timestamp: number) {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}.${month}.${day}`;
}

function getTimeAgo(timestamp: number) {
	return dayjs(timestamp).fromNow();
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
}: ConnectCardProps) {
	return (
		<div
			onClick={onClick}
			className="flex h-[19.375rem] w-full max-w-[18.4375rem] cursor-pointer flex-col rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 sm:h-[12.5rem] sm:max-w-[40.25rem] sm:flex-row md:max-w-[76rem]">
			<h3 className="truncate px-4 pt-3 pb-3 text-base font-semibold text-gray-900 sm:hidden">
				{title}
			</h3>

			<div className="// ← 294px / 144px order-2 h-[9rem] w-[18.375rem] shrink-0 overflow-hidden rounded-xl sm:order-1 sm:h-full sm:w-[12.5rem]">
				<img src={imageUrl} alt={title} className="h-full w-full object-cover" />
			</div>

			<div className="order-3 flex flex-1 flex-col px-4 sm:order-2 sm:px-6">
				<div className="flex flex-col gap-1">
					<h3 className="hidden pt-4 text-base font-semibold text-gray-900 sm:block">{title}</h3>

					<p className="line-clamp-2 pt-3 pb-4 text-sm text-gray-600">{description}</p>
				</div>

				<div className="mt-auto flex items-center justify-between pb-6 text-xs text-gray-400 sm:pb-6">
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<IcPerson size="xxs" color="gray-400" />
							<span>{author}</span>
						</div>
						<span>{formatDate(date)}</span>
					</div>

					<div className="flex items-center gap-4">
						<span>{getTimeAgo(date)}</span>

						<div className="flex items-center gap-1">
							<IcThumbOutline color="gray-400" size={15} />
							<span>{likeCount}</span>
						</div>

						<div className="flex items-center gap-1">
							<IcMessageOutline color="gray-400" size={15} />
							<span>{commentCount}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
