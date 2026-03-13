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

export const MultipleFilters: Story = {
	render: () => {
		const [activeFilter, setActiveFilter] = useState("최신순");

		return (
			<div className="flex gap-4">
				<FilterButton
					label="최신순"
					isActive={activeFilter === "최신순"}
					onClick={() => setActiveFilter("최신순")}
				/>
				<FilterButton
					label="마감 임박"
					isActive={activeFilter === "마감 임박"}
					onClick={() => setActiveFilter("마감 임박")}
				/>
				<FilterButton
					label="인기순"
					isActive={activeFilter === "인기순"}
					onClick={() => setActiveFilter("인기순")}
				/>
			</div>
		);
	},
};
