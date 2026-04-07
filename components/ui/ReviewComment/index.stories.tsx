import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewComment from ".";

const meta: Meta<typeof ReviewComment> = {
	title: "Features/Commons/ReviewComment",
	component: ReviewComment,
	tags: ["autodocs"],
	argTypes: {
		comment: {
			control: "text",
			description: "리뷰 댓글 내용",
		},
	},
};

export default meta;

type Story = StoryObj<typeof ReviewComment>;

export const Default: Story = {
	args: {
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus at in mollitia maiores unde et, fuga iusto temporibus obcaecati, ab sint maxime eius eveniet eligendi iste velit deleniti asperiores nostrum?",
	},
};
