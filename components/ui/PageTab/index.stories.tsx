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
				component: "페이지 탭 독립 컴포넌트",
			},
		},
	},
	argTypes: {
		icon: {
			control: false,
			table: { type: { summary: "React.ReactNode" } },
		},
		children: {
			control: false,
			type: { name: "other", value: "React.ReactNode", required: true },
			table: { type: { summary: "React.ReactNode" } },
		},
		isActive: {
			control: { type: "boolean" },
			description: "페이지 탭 활성 상태",
		},
		onClick: { control: false, action: "clicked", description: "페이지 탭 클릭 시 호출되는 콜백" },
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
