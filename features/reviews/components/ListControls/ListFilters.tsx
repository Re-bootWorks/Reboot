"use client";

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

interface ListFiltersProps {
	onWillChange?: () => void;
}

export default function ListFilters({ onWillChange }: ListFiltersProps) {
	const { get, set } = useQueryParams();

	const dateStart = get(QUERY_PARAM_KEYS.DATE_START);
	const dateEnd = get(QUERY_PARAM_KEYS.DATE_END);
	const regionParam = get(QUERY_PARAM_KEYS.REGION);
	const sortByParam = get(QUERY_PARAM_KEYS.SORT_BY);
	const sortOrderParam = get(QUERY_PARAM_KEYS.SORT_ORDER);

	const region = getRegionItem(regionParam);
	const sortBy = getSortByItem(sortByParam);
	const sortOrder = getSortOrderItem(sortOrderParam);

	const dateRange = {
		from: dateStart ? dateStart.split("T")[0] : "",
		to: dateEnd ? dateEnd.split("T")[0] : "",
	};

	function handleChangeDate(value: { from: string; to: string }) {
		const nextDateStart = value.from || null;
		const nextDateEnd = value.to || null;

		if ((dateStart ?? null) === nextDateStart && (dateEnd ?? null) === nextDateEnd) {
			return;
		}

		onWillChange?.();
		set({
			[QUERY_PARAM_KEYS.DATE_START]: nextDateStart,
			[QUERY_PARAM_KEYS.DATE_END]: nextDateEnd,
		});
	}

	function handleChangeLocation(data: RegionFilterValue) {
		const param = buildRegionParam(data.region, data.district);

		if ((regionParam ?? null) === param) {
			return;
		}

		onWillChange?.();
		set({ [QUERY_PARAM_KEYS.REGION]: param });
	}

	function handleChangeSortOrder(v: string) {
		if (sortOrder.value === v) {
			return;
		}

		onWillChange?.();
		set({ [QUERY_PARAM_KEYS.SORT_ORDER]: v });
	}

	function handleChangeSortBy(v: string) {
		if (sortBy.value === v) {
			return;
		}

		onWillChange?.();
		set({ [QUERY_PARAM_KEYS.SORT_BY]: v });
	}

	return (
		<div
			role="group"
			aria-label="모임 필터 그룹"
			className="flex items-center justify-center gap-x-1.5">
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
