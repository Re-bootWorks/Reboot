import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SendButton from "./index";

const meta: Meta<typeof SendButton> = {
	title: "Buttons/SendButton",
	component: SendButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof SendButton>;

export const Default: Story = {};
