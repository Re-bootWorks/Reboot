import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RegionFilter from "./index";

const meta: Meta<typeof RegionFilter> = {
	title: "Filter/RegionFilter",
	component: RegionFilter,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;

type Story = StoryObj<typeof RegionFilter>;

export const Default: Story = {
	render: () => {
		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<RegionFilter />
			</div>
		);
	},
};
