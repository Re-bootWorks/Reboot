import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTabs from ".";
import { IcAlignLeft } from "../icons";

const meta: Meta<typeof PageTabs.Item> = {
	title: "UI/PageTabs/Item",
	component: PageTabs.Item,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "PageTabs 하위 탭 아이템 버튼 컴포넌트",
			},
		},
	},
	argTypes: {
		id: {
			control: false,
			description: "식별 ID",
			type: { name: "string", required: true },
		},
		icon: {
			control: false,
			description: "아이콘",
			type: { name: "other", value: "React.ReactNode", required: false },
			table: { type: { summary: "React.ReactNode" } },
		},
		children: {
			control: false,
			description: "텍스트 또는 컴포넌트 라벨",
			type: { name: "other", value: "React.ReactNode", required: true },
			table: { type: { summary: "React.ReactNode" } },
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "tab1",
		children: "텍스트 탭",
	},
	render: (args) => (
		<PageTabs defaultId="tab1">
			<PageTabs.Item {...args} />
		</PageTabs>
	),
};

export const WithIcon: Story = {
	args: {
		id: "tab1",
		icon: <IcAlignLeft />,
		children: "아이콘 탭",
	},
	render: (args) => (
		<PageTabs defaultId="tab1">
			<PageTabs.Item {...args} />
		</PageTabs>
	),
};
