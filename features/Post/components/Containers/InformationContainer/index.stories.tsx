import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InformationContainer from "./index";

const meta: Meta<typeof InformationContainer> = {
	title: "POSTS/InformationContainer",
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

const now = new Date();
const meetingDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
const in12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
const past1Hour = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

const defaultArgs = {
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	dateTime: meetingDate,
	registrationEnd: in12Hours,
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

export const DeadlineFar: Story = {
	name: "N일 후 마감",
	args: { ...defaultArgs, isHost: false, registrationEnd: in2Days },
};

export const DeadlineSoon: Story = {
	name: "오늘 HH시 마감",
	args: { ...defaultArgs, isHost: false, registrationEnd: in12Hours },
};

export const Closed: Story = {
	name: "모집 마감 (버튼 비활성화)",
	args: { ...defaultArgs, isHost: false, registrationEnd: past1Hour },
};

export const LongTitle: Story = {
	name: "긴 제목",
	args: {
		...defaultArgs,
		isHost: false,
		name: "제목이 아주 길어질 경우 말줄임표로 처리되는지 확인하는 모임입니다",
	},
};

export const DifferentRegion: Story = {
	name: "다른 지역/타입",
	args: {
		...defaultArgs,
		isHost: false,
		name: "홍대 독서 모임",
		type: "독서",
		region: "홍대입구",
	},
};
