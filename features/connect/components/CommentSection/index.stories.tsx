import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommentSection from "./index";

const meta: Meta<typeof CommentSection> = {
	title: "Connect/CommentSection",
	component: CommentSection,
};

export default meta;

type Story = StoryObj<typeof CommentSection>;

const comments = [
	{
		id: 1,
		content: "테스트 댓글입니다",
		createdAt: new Date().toISOString(),
		author: {
			id: 1,
			name: "유저1",
		},
		likeCount: 0,
	},
];

export const Default: Story = {
	args: {
		postId: 1,
	},
};
