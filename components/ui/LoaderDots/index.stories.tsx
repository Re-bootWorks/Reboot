import { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoaderDots, { SIZE_MAP } from ".";

const meta: Meta<typeof LoaderDots> = {
	title: "UI/LoaderDots",
	component: LoaderDots,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "로딩 시 보여주는 세 개의 점으로 구성된 Loader 컴포넌트",
			},
		},
	},
	argTypes: {
		size: {
			control: { type: "radio" },
			options: Object.keys(SIZE_MAP),
			table: {
				type: { summary: "SizeKey | number | px | %" },
			},
		},
		className: {
			control: { type: "select" },
			options: ["fill-purple-500", "fill-orange-500", "fill-green-500", "fill-gray-500"],
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <LoaderDots {...args} />,
};
