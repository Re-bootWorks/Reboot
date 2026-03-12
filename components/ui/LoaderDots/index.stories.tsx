import { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoaderDots from ".";

const meta: Meta<typeof LoaderDots> = {
	title: "UI/LoaderDots",
	component: LoaderDots,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "로딩 시 보여주는 세 개의 점으로 구성된 Loader 컴포넌트",
			},
		},
	},

	argTypes: {
		size: {
			control: { type: "radio" },
			options: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
			description: "지정 사이즈 또는 숫자, px, % 단위",
		},
		className: {
			control: { type: "select" },
			options: ["fill-purple-500", "fill-orange-500", "fill-green-500", "fill-gray-500"],
			description: "Svg Circle Custom Style",
		},
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "size와 className으로 세부 스타일 조정",
			},
		},
	},
	render: (args) => <LoaderDots {...args} />,
};
