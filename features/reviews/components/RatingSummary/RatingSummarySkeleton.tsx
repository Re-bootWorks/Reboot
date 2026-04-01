import Skeleton from "react-loading-skeleton";

export default function RatingSummarySkeleton() {
	return (
		<div className="my-4 w-full rounded-3xl md:my-6 md:rounded-4xl lg:mt-8 lg:mb-6">
			<Skeleton width="100%" height={200} borderRadius={24} />
		</div>
	);
}
