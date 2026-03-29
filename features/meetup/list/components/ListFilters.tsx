"use client";

import { useCategoryStore } from "@/store/category.store";
import { QUERY_KEYS, SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "../constants";
import { getSortByItem, getSortOrderItem } from "../utils";
import { cn } from "@/utils/cn";
import TabButton from "@/components/ui/Buttons/TabButton";
import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import type { Option } from "@/components/ui/Filter/RegionFilter/option";
// import { REGION_DATA } from "@/constants/region";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import { useQueryParams } from "@/hooks/useQueryParams";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { transformRegionData } from "../utils";

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

	function handleChangeType(v: string | null) {
		set({ [QUERY_KEYS.TYPE]: v });
	}

	return (
		<div className="relative">
			<ul ref={ref} className={cn(containerStyle, "flex gap-x-2.5")} {...events}>
				<TypeFilterItem
					key="all"
					name="전체"
					selected={type === "all"}
					onClick={() => handleChangeType("all")}
				/>
				{categories.map((i) => (
					<TypeFilterItem
						key={i.name}
						name={i.name}
						selected={type === i.name}
						onClick={() => handleChangeType(i.name)}
					/>
				))}
			</ul>
			{overlays}
		</div>
	);
}

interface TypeFilterItemProps {
	name: string;
	selected: boolean;
	onClick: () => void;
}
function TypeFilterItem({ name, selected, onClick }: TypeFilterItemProps) {
	return (
		<li key={name} className="whitespace-nowrap">
			<TabButton selected={selected} onClick={onClick}>
				{name}
			</TabButton>
		</li>
	);
}

// 우측 드롭다운 필터 목록
export type RegionFilterValue = {
	region: Option | null;
	district: Option | null;
};
export type RegionFilterParams = {
	fullLabel: string;
} & RegionFilterValue;
function DropdownFilters() {
	const { get, set } = useQueryParams();
	const date = get(QUERY_KEYS.DATE);
	const region = transformRegionData(get(QUERY_KEYS.REGION));
	const sortBy = getSortByItem(get(QUERY_KEYS.SORT_BY)) ?? SORT_BY_OPTIONS[0].value;
	const sortOrder = getSortOrderItem(get(QUERY_KEYS.SORT_ORDER)) ?? SORT_ORDER_OPTIONS[0].value;

	function handleChangeDate(v: string) {
		set({ [QUERY_KEYS.DATE]: v });
	}
	function handleChangeRegion(data: RegionFilterParams) {
		set({ [QUERY_KEYS.REGION]: data.fullLabel });
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
			<RegionFilter value={region} onChange={handleChangeRegion} />
			<FilterDropdown value={sortBy.label} items={SORT_BY_OPTIONS} onChange={handleChangeSortBy} />
			<FilterDropdown
				value={sortOrder.label}
				items={SORT_ORDER_OPTIONS}
				onChange={handleChangeSortOrder}
			/>
		</div>
	);
}
