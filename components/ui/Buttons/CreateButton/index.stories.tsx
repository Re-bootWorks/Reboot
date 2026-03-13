import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateButton from "./index";

const meta: Meta<typeof CreateButton> = {
	title: "Buttons/CreateButton",
	component: CreateButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof CreateButton>;

export const Default: Story = {
	args: {
		children: "모임 만들기",
	},
};
