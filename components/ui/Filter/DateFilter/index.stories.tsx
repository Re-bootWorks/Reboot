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
		<div className="min-h-screen bg-gray-100">
			<div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
				<div className="flex justify-start">
					<DateFilter value={date} onChange={setDate} />
				</div>
			</div>
		</div>
	);
}

export const Default: Story = {
	render: () => <ControlledDateFilter />,
};
