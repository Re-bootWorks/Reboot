import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import FilterButton from "./index";

const meta: Meta<typeof FilterButton> = {
	title: "Buttons/FilterButton",
	component: FilterButton,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof FilterButton>;

export const Default: Story = {
	args: {
		label: "최신순",
		isActive: false,
	},
};

export const Active: Story = {
	args: {
		label: "최신순",
		isActive: true,
	},
};

export const Interactive: Story = {
	render: () => {
		const [active, setActive] = useState(false);

		return <FilterButton label="최신순" isActive={active} onClick={() => setActive(!active)} />;
	},
};

export const ParentColor: Story = {
	render: () => {
		return (
			<div className="text-purple-600">
				<FilterButton label="최신순" />
			</div>
		);
	},
};
