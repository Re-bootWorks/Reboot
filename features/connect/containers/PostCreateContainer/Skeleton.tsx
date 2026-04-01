export default function PostCreateSkeleton() {
	return (
		<div className="mx-auto mt-12 max-w-3xl px-4">
			<div className="animate-pulse space-y-4">
				{/* 제목  */}
				<div className="flex items-center gap-2">
					<div className="h-10 flex-1 rounded-lg bg-gray-200" />
					<div className="h-10 w-[80px] rounded-[10px] bg-gray-200" />
				</div>

				{/* 에디터 */}
				<div className="rounded-3xl bg-gray-50 p-4 md:p-10">
					<div className="rounded-[24px] bg-white p-4 md:p-10">
						<div className="space-y-3">
							<div className="h-4 w-3/4 rounded bg-gray-200" />
							<div className="h-4 w-full rounded bg-gray-200" />
							<div className="h-4 w-5/6 rounded bg-gray-200" />
							<div className="h-4 w-2/3 rounded bg-gray-200" />
							<div className="h-4 w-full rounded bg-gray-200" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
