import Link from "next/link";
import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";

type CompactCardProps = {
	id: number;
	title: string;
	image: string;
	createdAt: string;
	likeCount: number;
	commentCount: number;
};

export default function CompactCard({
	id,
	title,
	image,
	createdAt,
	likeCount,
	commentCount,
}: CompactCardProps) {
	return (
		<Link href={`/post/${id}`}>
			<div className="flex h-[13.875rem] w-[10.125rem] cursor-pointer flex-col transition duration-300 ease-out hover:-translate-y-0.5 md:h-[15.75rem] md:w-[18.875rem]">
				<div className="h-[11.25rem] overflow-hidden rounded-[0.75rem]">
					<img src={image} alt={title} className="h-full w-full object-cover" />
				</div>
				<div className="mt-[0.5rem] flex flex-1 flex-col">
					<h3 className="line-clamp-2 text-base font-semibold text-gray-900">{title}</h3>
					<div className="mt-[0.25rem] flex items-center gap-3 text-xs text-gray-500">
						<span>{createdAt}</span>

						<div className="flex items-center gap-1">
							<IcThumbOutline size={14} />
							<span>{likeCount}</span>
						</div>

						<div className="flex items-center gap-1">
							<IcMessageOutline size={14} />
							<span>{commentCount}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
