import Link from "next/link";

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
			<div className="flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
				<div className="aspect-[16/9] overflow-hidden rounded-md">
					<img
						src={image}
						alt={title}
						className="w-full object-cover transition duration-300 hover:scale-105"
					/>
				</div>
				<h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
				<div className="justify-beteen flex items-center text-sm text-gray-500">
					<span>{createdAt}</span>
					<div className="flex items-center gap-3">
						<span>👍{likeCount}</span>
					</div>
					<div className="flex items-center gap-1">
						<span>💬{commentCount}</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
