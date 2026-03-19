import { Meta, StoryObj } from "@storybook/nextjs-vite";
import InputFile from ".";

const meta: Meta<typeof InputFile> = {
	title: "Inputs/InputFile",
	component: InputFile,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "이미지 첨부 및 썸네일 미리보기 컴포넌트",
			},
		},
	},
	args: {
		name: "file",
		label: "이미지 첨부",
		isRequired: false,
		isDestructive: false,
		hintText: "",
		accept: "image/*",
	},
	argTypes: {
		label: { control: "text" },
		hintText: { control: "text" },
		thumbSize: { control: "radio", options: ["large", "small"] },
		isRequired: { control: "boolean" },
		isDestructive: { control: "boolean" },
		ref: { control: false },
		defaultUrl: { control: false },
		name: { control: false },
		onChange: { action: "changed" },
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
	args: {
		thumbSize: "large",
	},
	render: (args) => <InputFile {...args} />,
};

export const Small: Story = {
	args: {
		thumbSize: "small",
	},
	render: (args) => <InputFile {...args} />,
};
