"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterDropdown } from "@/components/ui/Dropdowns/FilterDropdown";
import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import { Option } from "@/components/ui/Filter/RegionFilter/option";
import { SORT_OPTIONS } from "../../mockData";

export default function Filters() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [date, setDate] = useState("");
	const [location, setLocation] = useState<{
		region: Option | null;
		district: Option | null;
		fullLabel: string;
	}>({
		region: null,
		district: null,
		fullLabel: "",
	});

	const currentSortValue = useMemo(() => {
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");

		const matchedOption = SORT_OPTIONS.find(
			(option) => option.by === sortBy && option.order === sortOrder,
		);

		return matchedOption?.value ?? SORT_OPTIONS[0].value;
	}, [searchParams]);

	// 공통 쿼리 훅 사용으로 수정 예정
	const handleSortChange = (nextValue: string) => {
		const selectedOption = SORT_OPTIONS.find((option) => option.value === nextValue);

		if (!selectedOption) {
			return;
		}

		const params = new URLSearchParams(searchParams.toString());

		params.set("sortBy", selectedOption.by);
		params.set("sortOrder", selectedOption.order);

		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div
			role="group"
			aria-label="모임 필터 그룹"
			className="scrollbar-hide flex items-center justify-center overflow-x-auto">
			<DateFilter value={date} onChange={setDate} />
			<RegionFilter value={location} onChange={setLocation} />
			<FilterDropdown value={currentSortValue} onChange={handleSortChange} items={SORT_OPTIONS} />
		</div>
	);
}
