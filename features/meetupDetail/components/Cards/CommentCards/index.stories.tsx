import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommentCards from "./index";
import { ReviewScore } from "@/features/reviews/components/ReviewCard";

const meta: Meta<typeof CommentCards> = {
	title: "Features/MeetupDetail/CommentCards",
	component: CommentCards,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CommentCards>;

const mockMeeting = {
	id: 10,
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	image: "/assets/img/img_empty_purple.svg",
	dateTime: "2026-02-10T14:00:00.000Z",
};

const defaultArgs = {
	id: 1,
	teamId: "reboot",
	meetingId: 10,
	userId: 2,
	score: 5 as ReviewScore,
	comment: "코멘트를 작성하는 예시 중 하나 입니다.",
	createdAt: "2026-02-01T20:00:00.000Z",
	updatedAt: "2026-02-01T20:00:00.000Z",
	user: {
		id: 2,
		name: "김철수",
		image: "/assets/img/img_profile.svg",
	},
	meeting: mockMeeting,
};

export const Default: Story = {
	args: { ...defaultArgs },
};

export const MyReview: Story = {
	name: "나의 리뷰",
	args: {
		...defaultArgs,
		user: {
			id: 1,
			name: "나(작성자)",
			image: "/assets/img/img_profile.svg",
		},
	},
};

export const LongComment: Story = {
	name: "긴 코멘트",
	args: {
		...defaultArgs,
		comment:
			"아주 긴 코멘트가 들어올 경우 어떻게 보이는지 확인하는 예시입니다. 텍스트가 길어질 때 레이아웃이 깨지지 않는지 확인해주세요. 가독성을 위해 줄바꿈이나 패딩이 적절한지 체크합니다.",
	},
};

export const LowScore: Story = {
	name: "낮은 별점",
	args: {
		...defaultArgs,
		score: 2,
		comment: "아쉬운 점이 있었어요.",
	},
};
