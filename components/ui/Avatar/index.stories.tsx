import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Avatar from ".";

const meta: Meta<typeof Avatar> = {
	title: "UI/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "유저 프로필을 보여주는 Avatar 컴포넌트 ",
			},
		},
	},
	argTypes: {
		src: {
			control: "text",
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		src: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/v2/tmp/meetings/1774590273596-febde0d3-1a8a-4c4e-9528-2b7487df61ee.png",
		width: 40,
		height: 40,
	},
	render: (args) => <Avatar {...args} />,
};
