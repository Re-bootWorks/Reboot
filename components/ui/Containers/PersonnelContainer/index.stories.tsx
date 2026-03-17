import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PersonnelContainer from "./index";

const meta: Meta<typeof PersonnelContainer> = {
	title: "ui/PersonnelContainer",
	component: PersonnelContainer,
	tags: ["autodocs"],
	argTypes: {
		capacity: { control: "number" },
		participantCount: { control: false },
	},
};

export default meta;

type Story = StoryObj<typeof PersonnelContainer>;
const mockParticipants = [
	{ id: 1, user: { id: 2, name: "김철수", image: null } },
	{ id: 2, user: { id: 3, name: "이영희", image: null } },
	{ id: 3, user: { id: 4, name: "박민수", image: null } },
	{ id: 4, user: { id: 5, name: "최지연", image: null } },
	{ id: 5, user: { id: 6, name: "홍길동", image: null } },
	{ id: 6, user: { id: 7, name: "정다은", image: null } },
	{ id: 7, user: { id: 8, name: "김철수", image: null } },
	{ id: 8, user: { id: 9, name: "이영희", image: null } },
	{ id: 9, user: { id: 10, name: "박민수", image: null } },
	{ id: 10, user: { id: 11, name: "최지연", image: null } },
	{ id: 11, user: { id: 12, name: "홍길동", image: null } },
	{ id: 12, user: { id: 13, name: "정다은", image: null } },
];

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
