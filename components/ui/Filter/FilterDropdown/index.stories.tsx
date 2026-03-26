import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterDropdown } from "./index";

const meta: Meta<typeof FilterDropdown> = {
	title: "Filters/FilterDropdown",
	component: FilterDropdown,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof FilterDropdown>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState("마감임박");

		return (
			<FilterDropdown
				value={value}
				onChange={setValue}
				items={[
					{ label: "마감임박", value: "마감임박" },
					{ label: "참여인원순", value: "참여인원순" },
				]}
			/>
		);
	},
};
