import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterDropdown } from "./index";

const meta: Meta<typeof FilterDropdown> = {
	title: "UI/FilterDropdown",
	component: FilterDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilterDropdown>;

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState(args.value);
		return <FilterDropdown {...args} value={value} onChange={setValue} />;
	},
	args: {
		label: "날짜 전체",
		value: "날짜 전체",
		options: ["전체", "오늘", "이번주", "이번달"],
	},
};

export const RegionFilter: Story = {
	render: (args) => {
		const [value, setValue] = useState(args.value);
		return <FilterDropdown {...args} value={value} onChange={setValue} />;
	},
	args: {
		label: "지역 전체",
		value: "지역 전체",
		options: ["전체", "서울", "부산", "대구", "인천"],
	},
};
