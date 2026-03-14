import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProgressBar from ".";

const meta: Meta<typeof ProgressBar> = {
	title: "UI/ProgressBar",
	component: ProgressBar,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		max: {
			control: { type: "number", min: 1 },
		},
		current: {
			control: { type: "number", min: 0 },
		},
		hasAnimation: {
			control: "boolean",
		},
		className: {
			options: ["w-full h-[5px]", "w-[190px] h-[5px]", "w-[320px] h-[8px]"],
			control: { type: "select" },
		},
	},
	decorators: [(Story) => <Story />],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		max: 10,
		current: 6,
		className: "w-[190px] h-[5px]",
	},
};

export const NoAnimation: Story = {
	args: {
		max: 10,
		current: 4,
		hasAnimation: false,
		className: "w-[190px] h-[5px]",
	},
};
