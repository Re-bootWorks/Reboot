import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";

type PostCardProps = {
	title: string;
	description: string;
	imageUrl: string;
	author: string;
	date: number;
	timeAgo: string;
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

export default function PostCard({
	title,
	description,
	imageUrl,
	author,
	date,
	timeAgo,
	likeCount,
	commentCount,
	onClick,
}: PostCardProps) {
	return (
		<div
			onClick={onClick}
			className="flex h-auto w-full max-w-[76rem] cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 md:h-50 md:flex-row">
			<img src={imageUrl} alt={title} className="h-[12rem] w-full object-cover md:h-full md:w-50" />
			<div className="flex flex-1 flex-col px-4 py-3 md:px-6 md:py-4">
				<div className="flex flex-col gap-1">
					<h3 className="line-clamp-2 text-base font-semibold text-gray-900 md:line-clamp-1 md:text-lg">
						{title}
					</h3>

					<p className="line-clamp-2 text-xs leading-relaxed text-gray-600 md:text-sm">
						{description}
					</p>
				</div>

				<div className="mt-2 flex items-center justify-between text-xs text-gray-400 md:mt-auto">
					<div className="flex items-center gap-2">
						<span>{author}</span>
						<span>{formatDate(date)}</span>
					</div>

					<div className="flex items-center gap-4">
						<span>{timeAgo}</span>

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
