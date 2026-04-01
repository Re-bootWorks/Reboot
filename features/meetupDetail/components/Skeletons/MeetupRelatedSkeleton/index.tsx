import Skeleton from "react-loading-skeleton";

export default function MeetupRelatedSkeleton() {
	return (
		<section className="mt-17 flex w-full flex-col gap-3 md:mt-18">
			<Skeleton width={160} height={24} className="ml-1.5" />
			<div className="grid grid-cols-2 gap-4 md:flex md:gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="w-full md:w-75.5">
						<Skeleton className="aspect-square w-full rounded-2xl md:rounded-3xl" />
						<Skeleton width={120} height={20} className="mt-2.5" />
						<Skeleton width={80} height={16} className="mt-1" />
					</div>
				))}
			</div>
		</section>
	);
}
