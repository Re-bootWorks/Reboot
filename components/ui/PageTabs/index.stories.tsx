import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTabs from ".";
import { IcAlignCenter, IcAlignLeft, IcAlignRight } from "../icons";

const DATA_SAMPLE = [
	{ id: "left", label: "Left", icon: <IcAlignLeft /> },
	{ id: "right", label: "Right", icon: <IcAlignRight /> },
	{ id: "center", label: "AlignCenterLongLabel", icon: <IcAlignCenter /> },
];

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
		data: {
			table: { category: "Required" },
			description: ["- `id`: string", "- `label`: string | ReactNode", "- `icon?`: ReactNode"].join(
				"\n",
			),
		},
		defaultId: {
			control: false,
			description: "초기 활성 탭 ID (마운트 시 1회만 사용)",
		},
		onChange: {
			action: "changed",
			description: "페이지 탭 변경 시 호출되는 콜백",
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data: DATA_SAMPLE,
		defaultId: DATA_SAMPLE[0].id,
	},
	parameters: {
		docs: {
			description: {
				story: "data, defaultId, onChange 설정으로 페이지 탭 컴포넌트 구성",
			},
		},
	},
	render: (args) => <PageTabs {...args} />,
};
