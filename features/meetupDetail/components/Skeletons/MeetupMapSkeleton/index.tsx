import Skeleton from "react-loading-skeleton";

export default function MeetupMapSkeleton() {
	return (
		<section className="mt-10 flex w-full flex-col gap-3 md:mt-16">
			<Skeleton width={80} height={24} className="ml-1.5" />
			<Skeleton height={300} borderRadius={24} />
		</section>
	);
}
