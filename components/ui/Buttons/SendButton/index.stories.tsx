import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SendButton from "./index";

const meta: Meta<typeof SendButton> = {
	title: "Buttons/SendButton",
	component: SendButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		sizes: {
			control: "select",
			options: ["small", "medium", "large"],
			description: "버튼의 크기를 설정합니다.",
		},
	},
};

export default meta;

type Story = StoryObj<typeof SendButton>;

export const Default: Story = {};

export const Small: Story = {
	args: {
		sizes: "small",
	},
};

export const Medium: Story = {
	args: {
		sizes: "medium",
	},
};

export const Large: Story = {
	args: {
		sizes: "large",
	},
};
