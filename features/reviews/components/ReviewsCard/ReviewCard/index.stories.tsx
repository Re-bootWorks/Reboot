import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewCard from ".";
import { ReviewCardProps } from "@/features/reviews/types";

const meta: Meta<typeof ReviewCard> = {
	title: "Features/Reviews/ReviewCard",
	component: ReviewCard,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof ReviewCard>;

const BASE_ARGS: ReviewCardProps = {
	id: 1,
	meetingId: 1,
	meetingImage:
		"https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
	score: 3,
	userImage:
		"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
	userName: "럽워즈올",
	userEmail: "user@example.com",
	createdAt: "2026-02-01T20:00:00.000Z",
	comment: "혼자서 했다면 운동을 금방 잊었을 텐데, 모임 덕분에 꾸준히 하게 돼요.",
	meetingName: "힐링 오피스 스트레칭",
	meetingType: "취미/여가",
	userId: 1,
};

export const Default: Story = {
	args: BASE_ARGS,
};
