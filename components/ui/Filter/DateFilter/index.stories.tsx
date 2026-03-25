import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import DateFilter from ".";

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

function ControlledDateFilter() {
	const [date, setDate] = useState("");

	return (
		<div className="h-100 bg-gray-100">
			<DateFilter value={date} onChange={setDate} />
		</div>
	);
}

export const Default: Story = {
	render: () => <ControlledDateFilter />,
};
