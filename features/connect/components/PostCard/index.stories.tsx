import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ConnectCard from "./index";

const meta: Meta<typeof ConnectCard> = {
	title: " Features/connect/PostCard",
	component: ConnectCard,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof ConnectCard>;

export const Default: Story = {
	args: {
		title: "주말 러닝 모임, 새로 오실 분 환영합니다!",
		description:
			"매주 토요일 오전 8시, 한강에서 5km 러닝하는 모임이에요. 끝나고 같이 아침 먹으러 가는 게 포인트 🏃",
		imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
		author: "런러즈",
		date: Date.now(),
		likeCount: 8,
		commentCount: 3,
	},
};
