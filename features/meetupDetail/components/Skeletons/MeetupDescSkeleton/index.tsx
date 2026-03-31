import Skeleton from "react-loading-skeleton";

export default function MeetupDescSkeleton() {
	return (
		<section className="mt-10 flex w-full flex-col gap-3">
			<Skeleton width={80} height={24} className="ml-1.5" />
			<div className="rounded-3xl bg-white px-5 py-4 md:rounded-4xl md:px-12 md:py-6">
				<Skeleton count={3} height={20} className="mb-2" />
			</div>
		</section>
	);
}
