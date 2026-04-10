import Skeleton from "react-loading-skeleton";

export default function TabSkeleton() {
	return (
		<ul className="mb-6 flex gap-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<li key={index} className="grow md:min-w-38 md:grow-0">
					<Skeleton className="min-h-9 md:min-h-15" />
				</li>
			))}
		</ul>
	);
}
