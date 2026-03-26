import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import DateFilter from "@/components/ui/Filter/DateFilter";
import RegionFilter from "@/components/ui/Filter/RegionFilter";
import { FilterDropdown } from "@/components/ui/Filter/FilterDropdown";
import { Option } from "@/components/ui/Filter/RegionFilter/option";

const meta: Meta = {
	title: "Filters/FilterGroup",
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;

type Story = StoryObj;

function FilterGroup() {
	// 날짜
	const [date, setDate] = useState("");

	// 지역
	const [region, setRegion] = useState<{
		region: Option | null;
		district: Option | null;
		fullLabel: string;
	}>({
		region: null,
		district: null,
		fullLabel: "",
	});

	// 마감임박
	const [sort, setSort] = useState("deadline");

	const sortItems = [
		{ label: "마감임박순", value: "deadline" },
		{ label: "참여인원순", value: "participants" },
	];
	return (
		<div className="p-10">
			<div className="flex items-center gap-2">
				<DateFilter value={date} onChange={setDate} />

				<RegionFilter value={region} onChange={setRegion} />

				<FilterDropdown value={sort} items={sortItems} onChange={setSort} />
			</div>
		</div>
	);
}

export const Default: Story = {
	render: () => <FilterGroup />,
};
