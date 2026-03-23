import { Meta, StoryObj } from "@storybook/nextjs-vite";
import InputTextarea from ".";

const meta: Meta<typeof InputTextarea> = {
	title: "Inputs/InputTextarea",
	component: InputTextarea,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "텍스트 영역 입력 컴포넌트",
			},
		},
	},
	args: {
		name: "content",
		label: "내용",
		isResizeable: false,
		placeholder: "내용을 입력해주세요",
		hintText: "글자 수는 최대 500자까지 입력 가능합니다.",
		defaultValue: "기본 텍스트 내용",
		isRequired: false,
		isDestructive: false,
	},

	argTypes: {
		name: { control: false },
		label: { control: "text" },
		isRequired: { control: "boolean" },
		isDestructive: { control: "boolean" },
		hintText: { control: "text" },
		isResizeable: { control: "boolean" },
		defaultValue: { control: false },
		onChange: { action: "changed" },
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <InputTextarea {...args} />,
};
