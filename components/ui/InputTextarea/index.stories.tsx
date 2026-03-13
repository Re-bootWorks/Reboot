import { Meta, StoryObj } from "@storybook/nextjs-vite";
import InputTextarea from ".";

const meta: Meta<typeof InputTextarea> = {
	title: "UI/InputTextarea",
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
		id: "textarea-1",
		name: "content",
		label: "내용",
		required: false,
		isResizeable: false,
		placeholder: "내용을 입력해주세요",
		description: "글자 수는 최대 500자까지 입력 가능합니다.",
		defaultValue: "내용을 입력해주세요",
	},

	argTypes: {
		id: { control: false },
		name: { control: false },
		onChange: { action: "changed" },
	},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <InputTextarea {...args} />,
};
