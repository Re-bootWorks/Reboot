import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import FilterButton from "./index";

const meta: Meta<typeof FilterButton> = {
	title: "Buttons/FilterButton",
	component: FilterButton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
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
		const [isActive, setIsActive] = useState(false);

		return (
			<FilterButton label="최신순" isActive={isActive} onClick={() => setIsActive(!isActive)} />
		);
	},
};
