import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ListControls from ".";

const meta: Meta<typeof ListControls> = {
	title: "Features/Reviews/ListControls",
	component: ListControls,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
};

export default meta;

type Story = StoryObj<typeof ListControls>;

export const Default: Story = {};
