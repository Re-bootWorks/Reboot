import Skeleton from "react-loading-skeleton";

function ReviewCardSkeleton() {
	return (
		<article aria-hidden="true" className="flex h-full w-full flex-col gap-4 md:flex-row md:gap-8">
			<div className="w-full md:size-46 md:shrink-0">
				<div className="block h-36 w-full md:hidden">
					<Skeleton className="h-full w-full rounded-xl" borderRadius={12} />
				</div>

				<div className="hidden h-46 w-46 md:block">
					<Skeleton className="h-full w-full rounded-xl" borderRadius={12} />
				</div>
			</div>

			<div className="w-full border-b border-b-gray-200">
				<div className="flex h-full flex-col gap-3 pb-6 md:gap-0">
					<div className="flex flex-col gap-3 md:gap-6">
						<div className="relative flex flex-col gap-2 md:gap-3.5 md:pt-4">
							<div className="flex h-6 items-center justify-between">
								<div className="block md:hidden">
									<Skeleton width={100} height={20} borderRadius={9999} />
								</div>
								<div className="hidden md:block">
									<Skeleton width={120} height={24} borderRadius={9999} />
								</div>
							</div>

							<div className="flex items-center gap-1 md:gap-1.5">
								<div className="flex items-center gap-1.5">
									<Skeleton circle width={24} height={24} />

									<div className="block md:hidden">
										<Skeleton width={56} height={16} borderRadius={8} />
									</div>
									<div className="hidden md:block">
										<Skeleton width={72} height={20} borderRadius={8} />
									</div>
								</div>

								<div className="block md:hidden">
									<Skeleton width={72} height={16} borderRadius={8} />
								</div>
								<div className="hidden md:block">
									<Skeleton width={96} height={20} borderRadius={8} />
								</div>
							</div>
						</div>

						<div className="flex flex-col items-start gap-2">
							<div className="flex w-full flex-col gap-2">
								<div className="block w-full md:hidden">
									<Skeleton width="82%" height={20} borderRadius={8} />
								</div>
								<div className="hidden w-full md:block">
									<Skeleton width="98%" height={28} borderRadius={8} />
								</div>
							</div>
						</div>
					</div>

					<div className="block md:hidden">
						<Skeleton width={128} height={16} borderRadius={8} />
					</div>
					<div className="hidden md:block">
						<Skeleton width={176} height={20} borderRadius={8} />
					</div>
				</div>
			</div>
		</article>
	);
}

export default function ReviewsSectionSkeleton() {
	return (
		<div className="rounded-3xl bg-white p-6 md:rounded-4xl md:p-8">
			<div className="flex flex-col gap-4 md:gap-8">
				{Array.from({ length: 3 }).map((_, index) => (
					<ReviewCardSkeleton key={index} />
				))}
			</div>
		</div>
	);
}
