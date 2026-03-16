import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CompactCard from "./index";

const meta: Meta<typeof CompactCard> = {
	title: "Post/CompactCard",
	component: CompactCard,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CompactCard>;

export const Default: Story = {
	args: {
		id: 1,
		title: "주말 러닝 모임 같이 하실 분",
		image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200",
		createdAt: "2시간 전",
		likeCount: 8,
		commentCount: 3,
	},
};

export const LongTitle: Story = {
	args: {
		id: 2,
		title:
			"아주 긴 제목 테스트입니다 이것은 카드에서 line clamp가 정상적으로 작동하는지 확인하기 위한 제목입니다",
		image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
		createdAt: "5시간 전",
		likeCount: 12,
		commentCount: 5,
	},
};

export const PopularPost: Story = {
	args: {
		id: 3,
		title: "인기 많은 게시글",
		image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200",
		createdAt: "1일 전",
		likeCount: 120,
		commentCount: 48,
	},
};
