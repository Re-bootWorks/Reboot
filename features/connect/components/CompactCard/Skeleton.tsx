export function CompactCardSkeleton() {
	return (
		<div className="flex h-[13.875rem] w-[10.125rem] shrink-0 animate-pulse flex-col md:h-[15.75rem] md:w-[19rem]">
			{/* 이미지 */}
			<div className="h-[11.25rem] overflow-hidden rounded-[1.5rem] bg-gray-200" />

			{/* 텍스트 영역 */}
			<div className="mt-3.5 flex flex-1 flex-col px-1">
				{/* 제목 (2줄) */}
				<div className="space-y-1.5">
					<div className="h-4 w-3/4 rounded bg-gray-200" />
					<div className="h-4 w-1/2 rounded bg-gray-200" />
				</div>

				{/* 메타 영역 */}
				<div className="mt-[0.25rem] flex items-center gap-3">
					<div className="h-3 w-12 rounded bg-gray-200" />
					<div className="h-3 w-8 rounded bg-gray-200" />
					<div className="h-3 w-8 rounded bg-gray-200" />
				</div>
			</div>
		</div>
	);
}
