import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateOpenButton from "./components/CreateOpenButton";

const meta: Meta<typeof CreateOpenButton> = {
	title: "Features/Meetup/Create/CreateOpenButton",
	component: CreateOpenButton,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		onClick: { action: "clicked" },
	},
};

export default meta;

type Story = StoryObj<typeof CreateOpenButton>;

export const Default: Story = {};
