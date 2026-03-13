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
				component: "PageTabs 하위 탭 아이템 컴포넌트",
			},
		},
	},
	argTypes: {
		id: {
			control: false,
			type: { name: "string", required: true },
		},
		children: {
			control: false,
			type: { name: "other", value: "React.ReactNode", required: true },
			table: { type: { summary: "React.ReactNode" } },
		},
		icon: {
			control: false,
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
