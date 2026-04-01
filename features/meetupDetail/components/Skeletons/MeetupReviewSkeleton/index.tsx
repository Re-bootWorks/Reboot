import Skeleton from "react-loading-skeleton";

export default function MeetupReviewSkeleton() {
	return (
		<section className="mt-10 w-full md:mt-16">
			<Skeleton width={120} height={24} className="mb-4 ml-1.5" />
			<div className="rounded-3xl bg-white px-5 pt-4 pb-2 md:rounded-4xl md:px-12 md:py-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="border-b border-gray-200 py-6 last:border-none">
						<Skeleton width={100} height={20} className="mb-2" />
						<div className="flex gap-2">
							<Skeleton width={24} height={24} borderRadius={999} />
							<Skeleton width={80} height={20} />
						</div>
						<Skeleton count={2} height={18} className="mt-3" />
					</div>
				))}
			</div>
		</section>
	);
}
