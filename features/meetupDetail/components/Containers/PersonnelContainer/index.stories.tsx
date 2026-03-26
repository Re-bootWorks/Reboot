import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PersonnelContainer from "./index";
import { mockParticipants } from "./mocks";

const meta: Meta<typeof PersonnelContainer> = {
	title: "Features/MeetupDetail/PersonnelContainer",
	component: PersonnelContainer,
	tags: ["autodocs"],
	argTypes: {
		capacity: { control: "number" },
		participantCount: { control: false },
	},
};

export default meta;

type Story = StoryObj<typeof PersonnelContainer>;

const defaultArgs = {
	capacity: 10,
	participantCount: 5,
	participants: mockParticipants.slice(0, 5),
};

export const Default: Story = {
	args: { ...defaultArgs },
};

export const Full: Story = {
	args: {
		...defaultArgs,
		participantCount: 10,
		participants: mockParticipants.slice(0, 10),
	},
};

export const AlmostFull: Story = {
	args: {
		...defaultArgs,
		participantCount: 9,
		participants: mockParticipants.slice(0, 9),
	},
};
