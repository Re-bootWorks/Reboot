export default function PostDetailCardSkeleton() {
	return (
		<div className="w-full rounded-[48px] bg-white px-6 pt-6 pb-5 md:px-10 md:pt-10 md:pb-9 lg:px-16 lg:pt-16 lg:pb-14">
			{/* 제목 */}
			<div className="flex items-start justify-between">
				<div className="h-8 w-2/3 animate-pulse rounded-lg bg-gray-200" />
				<div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 작성자 */}
			<div className="mt-3 flex items-center gap-2 md:mt-5">
				<div className="h-4 w-4 animate-pulse rounded-full bg-gray-200" />
				<div className="h-4 w-32 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 내용 */}
			<div className="mt-6 flex flex-col gap-3 md:mt-10">
				<div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
				<div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
				<div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
				<div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 이미지 */}
			<div className="mt-8">
				<div className="h-[200px] w-[200px] animate-pulse rounded-3xl bg-gray-200" />
			</div>

			{/* 하단 정보 */}
			<div className="mt-10 flex items-center gap-2 md:mt-12">
				<div className="h-4 w-12 animate-pulse rounded-lg bg-gray-200" />
				<div className="h-4 w-10 animate-pulse rounded-lg bg-gray-200" />
				<div className="h-4 w-10 animate-pulse rounded-lg bg-gray-200" />
			</div>
		</div>
	);
}
