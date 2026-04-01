import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import EditButton from "./index";

const meta: Meta<typeof EditButton> = {
	title: "Buttons/EditButton",
	component: EditButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof EditButton>;

export const Default: Story = {};
