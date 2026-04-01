import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from ".";

const meta: Meta<typeof Button> = {
	title: "Buttons/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "버튼에 표시될 텍스트 작성",
		},
		className: {
			control: "text",
			description: "버튼 스타일을 custom 설정",
		},
		sizes: {
			control: "select",
			description: "버튼의 크기 옵션을 설정",
			options: ["small", "smallMedium", "medium", "mediumLarge", "large"],
		},
		colors: {
			control: "select",
			description: "버튼의 색상 스타일 설정",
			options: ["purple", "purpleBorder", "grayBorder"],
		},
		isPending: {
			control: "boolean",
			description: "활성화 시 스피너가 표시되고 버튼이 비활성화됩니다.",
		},
		disabled: {
			control: "boolean",
			description: "버튼 비활성화 스타일 적용 설정",
		},
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: "참여하기",
		sizes: "large",
		colors: "purple",
	},
};

export const PurpleBorder: Story = {
	args: {
		children: "참여하기",
		sizes: "large",
		colors: "purpleBorder",
	},
};

export const GrayBorder: Story = {
	args: {
		children: "참여하기",
		sizes: "large",
		colors: "grayBorder",
	},
};

export const Disabled: Story = {
	args: {
		children: "참여하기",
		sizes: "large",
		colors: "purple",
		disabled: true,
	},
};

export const WFit: Story = {
	args: {
		children: "참여하기",
		sizes: "large",
		colors: "purple",
		className: "w-fit",
	},
};
