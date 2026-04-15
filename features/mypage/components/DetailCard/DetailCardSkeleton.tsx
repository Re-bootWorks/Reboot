import Skeleton from "react-loading-skeleton";

const STYLE = {
	itemBgBox: "rounded-3xl bg-white leading-0 md:flex md:gap-6 md:rounded-4xl md:p-6",
	itemImage: "h-39 md:size-47! rounded-t-3xl! md:rounded-3xl!",
	itemWrapper: "flex min-w-0 grow flex-col justify-between gap-3 p-4 md:px-0 md:py-2.5",
	itemContent:
		"flex flex-col gap-5.5  md:justify-between min-[870px]:flex-row min-[870px]:items-center",
	itemBadge: "rounded-3xl! h-8! w-16!",
	itemInfoList: "mt-1.5 flex gap-2.5 md:mt-2.5",
};

export default function DetailCardSkeleton({ showBadge = true }: { showBadge?: boolean }) {
	return (
		<ul className="flex flex-col gap-4 lg:gap-6">
			{Array.from({ length: 5 }).map((_, index) => (
				<li key={index} className={STYLE.itemBgBox}>
					<Skeleton className={STYLE.itemImage} />
					<div className={STYLE.itemWrapper}>
						<div className="min-w-0">
							{showBadge && (
								<div className="mb-3 flex gap-2">
									<Skeleton className={STYLE.itemBadge} />
									<Skeleton className={STYLE.itemBadge} />
								</div>
							)}
							<Skeleton width={250} height={30} />
						</div>
						<div className={STYLE.itemContent}>
							<div>
								<Skeleton width={60} height={20} />
								<div className={STYLE.itemInfoList}>
									<Skeleton width={60} height={20} />
									<Skeleton width={60} height={20} />
									<Skeleton width={60} height={20} />
								</div>
							</div>
							<div className="ml-auto">
								<Skeleton width={150} height={48} />
							</div>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
