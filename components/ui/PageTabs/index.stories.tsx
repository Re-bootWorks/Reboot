import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTabs from ".";
import { IcAlignLeft, IcAlignRight } from "../icons";

const meta: Meta<typeof PageTabs> = {
	title: "UI/PageTabs",
	component: PageTabs,
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
	parameters: {
		docs: {
			description: {
				story: "data, defaultId, onChange 설정으로 페이지 탭 컴포넌트 구성",
			},
		},
	},
	render: (args) => (
		<PageTabs defaultId="left" {...args}>
			<PageTabs.Item id="left" icon={<IcAlignLeft />}>
				Left
			</PageTabs.Item>
			<PageTabs.Item id="right" icon={<IcAlignRight />}>
				Right
			</PageTabs.Item>
			<PageTabs.Item id="center">CenterLongLabelWithoutIcon</PageTabs.Item>
		</PageTabs>
	),
};
