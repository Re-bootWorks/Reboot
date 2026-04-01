import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Thumbnail from ".";

const meta: Meta<typeof Thumbnail> = {
	title: "UI/Thumbnail",
	component: Thumbnail,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"이미지가 없는 경우 썸네일을 보여주고, 있는경우는 이미지 데이터를 보여주는 컴포넌트 ",
			},
		},
	},
	argTypes: {
		src: {
			control: "text",
		},
		className: {
			description: "사이즈 및 rounded 수치는 컴포넌트 별로 컨트롤 합니다.",
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		src: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/v2/tmp/meetings/1774590273596-febde0d3-1a8a-4c4e-9528-2b7487df61ee.png",
		width: 200,
		height: 200,
		className: "size-40 rounded-2xl",
	},
	render: (args) => <Thumbnail {...args} />,
};
