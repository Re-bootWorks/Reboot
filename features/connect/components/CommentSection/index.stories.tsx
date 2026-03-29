import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommentSection from "./index";

const meta: Meta<typeof CommentSection> = {
	title: "Connect/CommentSection",
	component: CommentSection,
};

export default meta;

type Story = StoryObj<typeof CommentSection>;

export const Default: Story = {
	args: {
		postId: 1,
	},
};
