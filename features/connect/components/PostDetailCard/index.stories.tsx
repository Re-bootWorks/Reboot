import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostDetailCard from "./index";
import Container from "@/components/layout/Container";

const meta: Meta<typeof PostDetailCard> = {
	title: "Connect/PostDetailCard",
	component: PostDetailCard,
	parameters: {
		layout: "fullscreen", // 중요
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PostDetailCard>;

export const Default: Story = {
	render: (args) => (
		<Container narrow className="bg-gray-50">
			<PostDetailCard {...args} />
		</Container>
	),
	args: {
		title: "모임 추천 부탁드립니다 :D",
		author: "니하오",
		createdAt: "2024.01.25",
		content: `
      <p>영어영어영어영어영어영어영어영어영어영어영어영어영어영어영어.</p>
      <p>영어영어영어영어영어영어영어영어영어영어영어영어영어영어영어.</p>
      <p>영어영어영어영어영어영어영어영어영어영어영어영어영어영어영어.</p>
    `,
		imageUrl: "https://picsum.photos/200",
		likeCount: 8,
		commentCount: 3,
	},
};
