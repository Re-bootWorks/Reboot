export default function CommentSectionSkeleton() {
	return (
		<section>
			{/* 댓글 개수 */}
			<header className="flex h-6 w-full items-center md:h-8">
				<div className="h-4 w-16 animate-pulse rounded-lg bg-gray-200" />
			</header>

			{/* 댓글 입력 영역 */}
			<div className="mt-3 flex items-center md:mt-4 lg:mt-8">
				<div className="pr-4">
					<div className="h-[54px] w-[54px] animate-pulse rounded-full bg-gray-200" />
				</div>
				<div className="h-[56px] flex-1 animate-pulse rounded-2xl bg-gray-200" />
			</div>

			{/* 댓글 리스트 */}
			<ul className="mt-6 flex flex-col gap-2 md:mt-8">
				{[1, 2, 3].map((i) => (
					<li key={i} className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
						<div className="pt-[8px] pb-[24px] md:pt-[16px]">
							{/* 댓글 내용 */}
							<div className="flex items-start justify-between pb-[8px]">
								<div className="h-5 w-3/4 animate-pulse rounded-lg bg-gray-200" />
							</div>
							{/* 메타 */}
							<div className="flex items-center gap-2">
								<div className="h-3 w-16 animate-pulse rounded-lg bg-gray-200" />
								<div className="h-3 w-3 animate-pulse rounded-full bg-gray-200" />
								<div className="h-3 w-12 animate-pulse rounded-lg bg-gray-200" />
							</div>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
