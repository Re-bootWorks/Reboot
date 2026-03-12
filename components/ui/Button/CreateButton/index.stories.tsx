import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateButton from "./index";

const meta: Meta<typeof CreateButton> = {
	title: "Button/CreateButton",
	component: CreateButton,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CreateButton>;

export const Large: Story = {
	args: {
		size: "Large",
		children: "모임 만들기",
	},
};

export const LargeWide: Story = {
	args: {
		size: "Large",
		children: "게시물 등록하기",
		className: "w-[221px]",
	},
};

export const Small: Story = {
	args: {
		size: "Small",
	},
};
