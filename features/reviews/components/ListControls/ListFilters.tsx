"use client";

import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import { useQueryParams } from "@/hooks/useQueryParams";
import { QUERY_KEYS, SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "@/features/meetup/list/constants";
import { getSortByItem, getSortOrderItem } from "@/features/meetup/list/utils";
import { buildRegionParam, getRegionItem, RegionFilterValue } from "@/features/reviews/utils";

export default function ListFilters() {
	const { get, set } = useQueryParams();
	const date = get(QUERY_KEYS.DATE);
	const region = getRegionItem(get(QUERY_KEYS.REGION));
	const sortBy = getSortByItem(get(QUERY_KEYS.SORT_BY)) ?? SORT_BY_OPTIONS[0].value;
	const sortOrder = getSortOrderItem(get(QUERY_KEYS.SORT_ORDER)) ?? SORT_ORDER_OPTIONS[0].value;

	function handleChangeDate(v: string) {
		set({ [QUERY_KEYS.DATE]: v });
	}
	function handleChangeLocation(data: RegionFilterValue) {
		const param = buildRegionParam(data.region, data.district);
		set({ [QUERY_KEYS.REGION]: param });
	}
	function handleChangeSortOrder(v: string) {
		set({ [QUERY_KEYS.SORT_ORDER]: v });
	}
	function handleChangeSortBy(v: string) {
		set({ [QUERY_KEYS.SORT_BY]: v });
	}

	return (
		<div role="group" aria-label="모임 필터 그룹" className="flex items-center justify-center">
			<DateFilter value={date ?? ""} onChange={handleChangeDate} />
			<RegionFilter value={region} onChange={handleChangeLocation} />
			<FilterDropdown value={sortBy.label} items={SORT_BY_OPTIONS} onChange={handleChangeSortBy} />
			<FilterDropdown
				value={sortOrder.label}
				items={SORT_ORDER_OPTIONS}
				onChange={handleChangeSortOrder}
			/>
		</div>
	);
}
