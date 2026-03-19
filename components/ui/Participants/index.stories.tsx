import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Participants } from "./index";

const meta: Meta<typeof Participants> = {
	title: "UI/Participants",
	component: Participants,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Participants>;

const mockParticipants = [
	{ id: 1, user: { id: 2, name: "김철수", image: null } },
	{ id: 2, user: { id: 3, name: "이영희", image: null } },
	{ id: 3, user: { id: 4, name: "박민수", image: null } },
	{ id: 4, user: { id: 5, name: "최지연", image: null } },
	{ id: 5, user: { id: 6, name: "홍길동", image: null } },
	{ id: 6, user: { id: 7, name: "정다은", image: null } },
];

// 4명 이하
export const FewParticipants: Story = {
	name: "4명 이하 (개별 이미지)",
	args: {
		participants: mockParticipants.slice(0, 3),
	},
};

// 4명
export const ExactlyFour: Story = {
	name: "4명 (경계값)",
	args: {
		participants: mockParticipants.slice(0, 4),
	},
};

// 5명 이상
export const ManyParticipants: Story = {
	name: "5명 이상 (+N 표시)",
	args: {
		participants: mockParticipants,
	},
};
