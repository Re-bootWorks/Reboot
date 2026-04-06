"use client";

import { useState } from "react";
import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import { useQueryParams } from "@/hooks/useQueryParams";
import {
	buildRegionParam,
	getRegionItem,
	getSortByItem,
	getSortOrderItem,
	type RegionFilterValue,
} from "@/features/reviews/utils";
import {
	QUERY_PARAM_KEYS,
	REVIEWS_SORT_BY_OPTIONS,
	REVIEWS_SORT_ORDER_OPTIONS,
} from "../../constants/filers";

export default function ListFilters() {
	const { get, set } = useQueryParams();

	const dateStart = get(QUERY_PARAM_KEYS.DATE_START);
	const dateEnd = get(QUERY_PARAM_KEYS.DATE_END);
	const region = getRegionItem(get(QUERY_PARAM_KEYS.REGION));
	const sortBy = getSortByItem(get(QUERY_PARAM_KEYS.SORT_BY)) ?? REVIEWS_SORT_BY_OPTIONS[0].value;
	const sortOrder =
		getSortOrderItem(get(QUERY_PARAM_KEYS.SORT_ORDER)) ?? REVIEWS_SORT_ORDER_OPTIONS[0].value;

	const [dateRange, setDateRange] = useState({
		from: dateStart ? dateStart.split("T")[0] : "",
		to: dateEnd ? dateEnd.split("T")[0] : "",
	});

	function handleChangeDate(value: { from: string; to: string }) {
		setDateRange(value);

		set({
			[QUERY_PARAM_KEYS.DATE_START]: value.from || null,
			[QUERY_PARAM_KEYS.DATE_END]: value.to || null,
		});
	}

	function handleChangeLocation(data: RegionFilterValue) {
		const param = buildRegionParam(data.region, data.district);
		set({ [QUERY_PARAM_KEYS.REGION]: param });
	}

	function handleChangeSortOrder(v: string) {
		set({ [QUERY_PARAM_KEYS.SORT_ORDER]: v });
	}

	function handleChangeSortBy(v: string) {
		set({ [QUERY_PARAM_KEYS.SORT_BY]: v });
	}

	return (
		<div role="group" aria-label="모임 필터 그룹" className="flex items-center justify-center">
			<DateFilter value={dateRange} onChange={handleChangeDate} />
			<RegionFilter value={region} onChange={handleChangeLocation} />
			<FilterDropdown
				value={sortBy.label}
				items={REVIEWS_SORT_BY_OPTIONS}
				onChange={handleChangeSortBy}
			/>
			<FilterDropdown
				value={sortOrder.label}
				items={REVIEWS_SORT_ORDER_OPTIONS}
				onChange={handleChangeSortOrder}
			/>
		</div>
	);
}
