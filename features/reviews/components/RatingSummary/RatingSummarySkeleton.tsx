import Skeleton from "react-loading-skeleton";

export default function RatingSummarySkeleton() {
	return (
		<section className="my-4 w-full md:my-6 lg:mt-8 lg:mb-6">
			<div className="bg-gradient-purple-200-lr w-full rounded-3xl border border-purple-400 px-[1.188rem] py-6 md:rounded-4xl md:px-6 md:py-[2.563rem]">
				<div className="mx-auto flex items-center justify-center">
					<div className="flex w-full max-w-[7.938rem] flex-col items-center justify-between md:max-w-49.5">
						<div className="flex h-15 flex-col items-center justify-center gap-2 md:h-auto">
							<div>
								<Skeleton width={56} height={32} borderRadius={8} />
							</div>

							<div className="h-5 w-25 md:h-9.5 md:w-47.5">
								<Skeleton width="100%" height="100%" borderRadius={6} />
							</div>
						</div>

						<div className="mt-1 w-22 md:h-6 md:w-30">
							<Skeleton width="100%" height="100%" borderRadius={6} />
						</div>
					</div>

					<div
						aria-hidden="true"
						className="mx-4 w-px self-stretch border-0 bg-purple-50 md:mx-6 lg:mx-35.5"
					/>

					<ul className="grid w-full max-w-36 gap-0.5 md:max-w-[20.813rem] md:gap-2">
						{Array.from({ length: 5 }).map((_, index) => (
							<li
								key={index}
								className="grid h-4 grid-cols-[auto_1fr_auto] items-center gap-x-2 md:h-5">
								<Skeleton width={24} height={15} borderRadius={6} />

								<Skeleton
									width="100%"
									height={index < 2 ? 6 : 5}
									borderRadius={9999}
									containerClassName="block w-full"
								/>

								<Skeleton width={16} height={15} borderRadius={6} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
