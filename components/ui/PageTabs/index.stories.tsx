import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTabs from ".";
import { IcAlignLeft, IcAlignRight } from "../icons";

const meta: Meta<typeof PageTabs> = {
	title: "UI/PageTabs",
	component: PageTabs,
	subcomponents: {
		Item: PageTabs.Item,
	},
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "페이지 탭 컴포넌트",
			},
		},
	},

	argTypes: {
		children: { control: false },
		defaultId: { control: false },
		onChange: { action: "changed" },
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<PageTabs defaultId="left" {...args}>
			<PageTabs.Item id="left" icon={<IcAlignLeft />}>
				왼쪽 정렬
			</PageTabs.Item>
			<PageTabs.Item id="right" icon={<IcAlignRight />}>
				오른쪽 정렬
			</PageTabs.Item>
			<PageTabs.Item id="center">아이콘 없는 중앙 정렬</PageTabs.Item>
		</PageTabs>
	),
};
