import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommentCard from "./index";

const meta: Meta<typeof CommentCard> = {
	title: "Connect/CommentCard",
	component: CommentCard,
};

export default meta;

type Story = StoryObj<typeof CommentCard>;

const baseData = {
	id: 1,
	content: "‘주말 힐링 산책 모임’ 어때요? 새로운 사람들도 쉽게 어울릴 수 있어요",
	authorName: "홍길동",
	date: new Date("2026-03-20").getTime(),
};

export const Default: Story = {
	args: {
		...baseData,
	},
};

export const LongContent: Story = {
	args: {
		...baseData,
		content:
			"이건 긴 댓글 테스트입니다. 이건 긴 댓글 테스트입니다. 이건 긴 댓글 테스트입니다. 이건 긴 댓글 테스트입니다.",
	},
};
