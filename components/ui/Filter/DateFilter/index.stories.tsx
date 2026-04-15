import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";
import DateFilter, { DateFilterValue } from ".";

const meta: Meta<typeof DateFilter> = {
	title: "Filters/DateFilter",
	component: DateFilter,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;

type Story = StoryObj<typeof DateFilter>;

function ValueViewer({ value }: { value: DateFilterValue }) {
	const label = useMemo(() => {
		if (!value.from && !value.to) return "선택된 값 없음";

		if (value.from === value.to) {
			return value.from;
		}

		return `${value.from || "-"} ~ ${value.to || "-"}`;
	}, [value]);

	return (
		<div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p className="text-sm font-semibold text-gray-900">현재 전달되는 value</p>
			<p className="mt-2 text-sm text-gray-700">{label}</p>
			<pre className="mt-3 overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs text-gray-800">
				{JSON.stringify(value, null, 2)}
			</pre>
		</div>
	);
}

function ControlledDateFilter({
	initialValue = { from: "", to: "" },
}: {
	initialValue?: DateFilterValue;
}) {
	const [date, setDate] = useState<DateFilterValue>(initialValue);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
				<div className="space-y-6">
					<div className="flex justify-start">
						<DateFilter value={date} onChange={setDate} />
					</div>

					<ValueViewer value={date} />
				</div>
			</div>
		</div>
	);
}

export const EmptyInitialValue: Story = {
	render: () => <ControlledDateFilter />,
};

export const WithSingleDate: Story = {
	render: () => (
		<ControlledDateFilter
			initialValue={{
				from: "2026-04-06",
				to: "2026-04-06",
			}}
		/>
	),
};

export const WithRangeDate: Story = {
	render: () => (
		<ControlledDateFilter
			initialValue={{
				from: "2026-04-01",
				to: "2026-04-05",
			}}
		/>
	),
};
