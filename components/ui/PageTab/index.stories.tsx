import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTab from ".";
import { IcAlignLeft } from "../icons";

const meta: Meta<typeof PageTab> = {
	title: "UI/PageTab",
	component: PageTab,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "페이지 탭 버튼 컴포넌트",
			},
		},
	},
	args: {
		isActive: false,
		hasBorder: true,
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "텍스트 탭",
	},
	render: (args) => <PageTab {...args} />,
};

export const WithIcon: Story = {
	args: {
		icon: <IcAlignLeft />,
		children: "아이콘 탭",
	},
	render: (args) => <PageTab {...args} />,
};
