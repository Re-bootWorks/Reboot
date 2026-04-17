"use client";

import { useCategoryStore } from "@/store/category.store";
import { cn } from "@/utils/cn";

interface ListFiltersSkeletonProps {
	className?: string;
}

export default function ListFiltersSkeleton({ className }: ListFiltersSkeletonProps) {
	const { categories } = useCategoryStore();
	const typeTabCount = categories.length + 1;

	return (
		<div
			className={cn(
				"flex flex-col justify-center gap-y-2 md:gap-4 lg:flex-row lg:items-start",
				className,
			)}
			aria-hidden>
			<div className="relative min-w-0">
				<TabRowSkeleton typeTabCount={typeTabCount} />
				<KeywordAreaSkeleton />
			</div>
			<DropdownRowSkeleton />
		</div>
	);
}

const tabScrollRowClass =
	"overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const tabSkeletonShape = "box-border h-9 shrink-0 rounded-[0.875rem] px-4 md:h-10 md:rounded-2xl";
const dropdownTriggerShape = "h-6 shrink-0 rounded-lg md:h-8";

function TabRowSkeleton({ typeTabCount }: { typeTabCount: number }) {
	return (
		<ul className={cn(tabScrollRowClass, "flex gap-x-2.5")} aria-hidden>
			{/* 검색 토글 */}
			<li className="whitespace-nowrap">
				<div
					className={cn(
						tabSkeletonShape,
						"flex min-w-[52px] animate-pulse items-center justify-center bg-gray-200",
					)}
				/>
			</li>
			{/* 타입 탭 */}
			{Array.from({ length: typeTabCount }, (_, i) => (
				<li key={i} className="whitespace-nowrap">
					<div className={cn(tabSkeletonShape, "w-20 animate-pulse bg-gray-200")} />
				</li>
			))}
		</ul>
	);
}

function KeywordAreaSkeleton() {
	return (
		<div
			className={cn(
				"grid transition-[grid-template-rows] duration-300 ease-out",
				"grid-rows-[0fr] lg:grid-rows-[1fr]",
			)}
			aria-hidden>
			<div className="min-h-0 overflow-hidden">
				<div className="m-0.5 mt-2.5">
					<div className="relative w-94">
						<div className="h-11 w-full animate-pulse rounded-full bg-gray-200" />
					</div>
				</div>
			</div>
		</div>
	);
}

function DropdownRowSkeleton() {
	return (
		<div className="flex shrink-0 items-center gap-x-1.5 lg:ml-auto" aria-hidden>
			{/* 모든 드롭다운 스켈레톤: 동일한 폭으로 통일 */}
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className={cn(dropdownTriggerShape, "w-21 animate-pulse bg-gray-200 md:w-23")}
				/>
			))}
		</div>
	);
}
