import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DeleteButton from "./index";

const meta: Meta<typeof DeleteButton> = {
	title: "Buttons/DeleteButton",
	component: DeleteButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof DeleteButton>;

export const Default: Story = {};
