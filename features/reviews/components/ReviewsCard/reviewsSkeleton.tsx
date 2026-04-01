import Skeleton from "react-loading-skeleton";

export default function ReviewsSectionSkeleton() {
	return (
		<div className="flex w-full flex-col gap-4 rounded-3xl md:gap-8">
			{Array.from({ length: 3 }).map((_, index) => (
				<Skeleton key={index} width="100%" height={200} borderRadius={24} />
			))}
		</div>
	);
}
