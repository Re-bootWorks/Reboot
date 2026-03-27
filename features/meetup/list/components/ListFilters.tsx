"use client";

import { useCategoryStore } from "@/store/category.store";
import { QUERY_KEYS, SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "../constants";
import { getSortByItem, getSortOrderItem } from "../utils";
import { cn } from "@/utils/cn";
import TabButton from "@/components/ui/Buttons/TabButton";
import DateFilter from "@/components/ui/Filter/DateFilter";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import { IcChevronDown } from "@/components/ui/icons";
import { useQueryParams } from "@/hooks/useQueryParams";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";

interface ListFiltersProps {
	/** 최상위 컨테이너 클래스 */
	className?: string;
}

export default function ListFilters({ className }: ListFiltersProps) {
	return (
		<div
			className={cn(
				"flex flex-col justify-center gap-y-2 pl-1",
				"md:gap-4 md:pl-2",
				"lg:flex-row lg:items-center",
				className,
			)}>
			<TypeFilters />
			<DropdownFilters />
		</div>
	);
}

// 좌측 모임 타입 버튼 목록
function TypeFilters() {
	const { ref, overlays, ...events } = useDragScroll<HTMLUListElement>();
	const { get, set } = useQueryParams();
	const { categories } = useCategoryStore();
	const type = get(QUERY_KEYS.TYPE) ?? categories[0].name;

	function handleChangeType(v: string) {
		set({ [QUERY_KEYS.TYPE]: v });
	}

	return (
		<div className="relative">
			<ul ref={ref} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
				{categories.map((i) => (
					<li key={i.name} className="whitespace-nowrap">
						<TabButton selected={type === i.name} onClick={() => handleChangeType(i.name)}>
							{i.name}
						</TabButton>
					</li>
				))}
			</ul>
			{overlays}
		</div>
	);
}

// 우측 드롭다운 필터 목록
function DropdownFilters() {
	const { get, set } = useQueryParams();
	const date = get(QUERY_KEYS.DATE);
	// TODO: const region = get(QUERY_KEYS.REGION);
	const sortBy = getSortByItem(get(QUERY_KEYS.SORT_BY)) ?? SORT_BY_OPTIONS[0].value;
	const sortOrder = getSortOrderItem(get(QUERY_KEYS.SORT_ORDER)) ?? SORT_ORDER_OPTIONS[0].value;

	function handleChangeDate(v: string) {
		set({ [QUERY_KEYS.DATE]: v });
	}
	function handleChangeSortOrder(v: string) {
		set({ [QUERY_KEYS.SORT_ORDER]: v });
	}
	function handleChangeSortBy(v: string) {
		set({ [QUERY_KEYS.SORT_BY]: v });
	}

	return (
		<div className="flex items-center lg:ml-auto">
			<DateFilter value={date ?? ""} onChange={handleChangeDate} />
			{/* TODO: RegionFilter 추가 시 하단 요소 제거 */}
			<div className="flex items-center px-2 py-1 text-red-500">
				지역 전체
				<IcChevronDown color="currentColor" />
			</div>
			<FilterDropdown value={sortBy.label} items={SORT_BY_OPTIONS} onChange={handleChangeSortBy} />
			<FilterDropdown
				value={sortOrder.label}
				items={SORT_ORDER_OPTIONS}
				onChange={handleChangeSortOrder}
			/>
		</div>
	);
}
