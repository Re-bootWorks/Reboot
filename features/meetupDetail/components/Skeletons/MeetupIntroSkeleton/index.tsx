import Skeleton from "react-loading-skeleton";

export default function MeetupIntroSkeleton() {
	return (
		<section className="flex w-full flex-col gap-4 md:flex-row lg:gap-5">
			{/* 이미지 영역 */}
			<div className="w-full md:w-1/2">
				<Skeleton className="aspect-343/241 w-full rounded-2xl md:h-full lg:rounded-4xl" />
			</div>

			{/* 정보 영역 */}
			<div className="flex w-full flex-col gap-5 md:w-1/2">
				{/* Information Container */}
				<div className="rounded-[20px] bg-white px-6 pt-5 pb-6 lg:rounded-4xl lg:px-10">
					<Skeleton width={80} height={24} className="mb-4" />
					<Skeleton width={200} height={28} className="mb-2" />
					<Skeleton width={120} height={20} className="mb-7" />
					<div className="flex gap-4">
						<Skeleton width={40} height={40} borderRadius={999} />
						<Skeleton height={40} className="flex-1" />
					</div>
				</div>
				{/* PersonnelContainer */}
				<div className="rounded-[20px] bg-white px-6 py-6 lg:rounded-[28px]">
					<Skeleton width={80} height={20} className="mb-3" />
					<Skeleton height={8} borderRadius={999} />
				</div>
			</div>
		</section>
	);
}
