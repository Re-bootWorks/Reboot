import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Participants } from "./index";
import { mockParticipants } from "@/features/meetupDetail/components/Containers/PersonnelContainer/mocks";

const meta: Meta<typeof Participants> = {
	title: "UI/Participants",
	component: Participants,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Participants>;

export const FewParticipants: Story = {
	name: "4명 이하 (개별 이미지)",
	args: {
		participants: mockParticipants.slice(0, 3),
	},
};

export const ExactlyFour: Story = {
	name: "4명 (경계값)",
	args: {
		participants: mockParticipants.slice(0, 4),
	},
};

export const ManyParticipants: Story = {
	name: "5명 이상 (+N 표시)",
	args: {
		participants: mockParticipants.slice(0, 6),
	},
};
