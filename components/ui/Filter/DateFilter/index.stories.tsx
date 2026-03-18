import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import DateFilter from ".";

const meta: Meta<typeof DateFilter> = {
	title: "Filters/DateFilter",
	component: DateFilter,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof DateFilter>;

function ControlledDateFilter() {
	const [date, setDate] = useState("");

	return (
		<div className="w-72">
			<DateFilter />
		</div>
	);
}

export const Default: Story = {
	render: () => <ControlledDateFilter />,
};
