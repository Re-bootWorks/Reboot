import Skeleton from "react-loading-skeleton";

const STYLE = {
	itemBox: "flex flex-col gap-3 md:flex-row md:items-center md:gap-8 group",
	itemImage: "h-39! rounded-xl1 md:size-47! md:rounded-3xl!",
	itemWrapper:
		"flex grow flex-col gap-3 border-b border-gray-200 pb-6 md:py-6 group-last-of-type:border-none",
	profileWrapper: "flex items-center gap-1.5",
};

export default function ReviewCardSkeleton() {
	return (
		<ul className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 md:rounded-4xl md:py-6 lg:gap-6 lg:p-8">
			{Array.from({ length: 5 }).map((_, index) => (
				<li key={index} className={STYLE.itemBox}>
					<Skeleton className={STYLE.itemImage} />
					<div className={STYLE.itemWrapper}>
						<div className="flex items-center justify-between gap-1.5">
							<Skeleton width={150} height={20} />
							<Skeleton width={24} height={24} />
						</div>
						<div className={STYLE.profileWrapper}>
							<Skeleton width={24} height={24} circle />
							<Skeleton width={150} height={20} />
						</div>
						<Skeleton width={200} height={20} />
						<Skeleton width={150} height={20} />
					</div>
				</li>
			))}
		</ul>
	);
}
