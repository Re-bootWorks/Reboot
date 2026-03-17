import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InformationContainer from "./index";

const meta: Meta<typeof InformationContainer> = {
	title: "ui/InformationContainer",
	component: InformationContainer,
	tags: ["autodocs"],
	argTypes: {
		name: { control: "text" },
		type: { control: "text" },
		region: { control: "text" },
		dateTime: { control: "text" },
		registrationEnd: { control: "text" },
		capacity: { control: "number" },
		isHost: { control: "boolean" },
	},
};

export default meta;

type Story = StoryObj<typeof InformationContainer>;

const defaultArgs = {
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	dateTime: "2월10일",
	registrationEnd: "13",
	capacity: 10,
};

export const User: Story = {
	name: "일반 사용자",
	args: { ...defaultArgs, isHost: false },
};

export const Host: Story = {
	name: "주최자",
	args: { ...defaultArgs, isHost: true },
};

export const LongTitle: Story = {
	args: {
		...defaultArgs,
		name: "제목이 아주 길어질 경우 말줄임표로 처리되는지 확인하는 모임입니다",
	},
};

export const DifferentRegion: Story = {
	args: {
		...defaultArgs,
		name: "홍대 독서 모임",
		type: "독서",
		region: "홍대입구",
	},
};
