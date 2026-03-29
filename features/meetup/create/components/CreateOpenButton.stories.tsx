import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateOpenButton from "./CreateOpenButton";

const meta: Meta<typeof CreateOpenButton> = {
	title: "Features/Meetup/Create/CreateOpenButton",
	component: CreateOpenButton,
	parameters: {
		layout: "centered",
		nextjs: { appDirectory: true },
	},
};

export default meta;

type Story = StoryObj<typeof CreateOpenButton>;

export const Default: Story = {};
