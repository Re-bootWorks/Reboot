import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostCard from "./index";

const meta: Meta<typeof PostCard> = {
	title: "UI/Post/PostCard",
	component: PostCard,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
	args: {
		title: "주말 러닝 모임, 새로 오실 분 환영합니다!",
		description:
			"매주 토요일 오전 8시, 한강에서 5km 러닝하는 모임이에요. 끝나고 같이 아침 먹으러 가는 게 포인트 🏃",
		imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
		author: "런러즈",
		date: 1706112000000,
		timeAgo: "2시간 전",
		likeCount: 8,
		commentCount: 3,
	},
};
